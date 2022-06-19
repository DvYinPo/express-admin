import { Request, Response, NextFunction, RequestHandler } from 'express';
import createError from 'http-errors';
import { dataSource } from '../database';
import { Comment, Issue, Project } from '../model';
import { valid } from '../util';

/**
 * 查询comment
 * @route '/comment'
 */
export const index = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const repository = dataSource.getRepository(Issue);
  const comment = await repository.find({
    where: {
      reporter: req['currentUser'],
    },
    relations: {
      comment: true,
    },
  });

  res.status(200).json({
    code: 0,
    message: 'query success!!!',
    reporter: req['currentUser'],
    data: {
      comment,
    },
  });
  return;
};

/**
 * 创建issue
 * @param req.body.name string
 * @param req.body.description string
 * @param req.body.id project id
 * @method POST
 */
export const create = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { name, description, id } = req.body;

  // value valid
  if (valid.isEmpty(id) || valid.isEmpty(name)) {
    next(createError(403, 'Warning! Missing "id" or "name" field!!!'));
    return;
  }

  const repository = dataSource.getRepository(Issue);
  const issue = await repository.findOneBy({ name, reporter: req['currentUser'], project: { id } });

  if (!!issue) {
    res.status(403).json({
      code: -1,
      message: 'Issue already exists!!!',
      issue,
    });
    return;
  }

  await repository.insert({
    name,
    description,
    reporter: req['currentUser'],
  });

  res.status(200).json({
    code: 0,
    msg: `issue '${name}' created successful!!!`,
    issue,
  });
  return;
};

/**
 * 更新issue
 * @param req.body.id number
 * @param req.body.name string
 * @param req.body.description string
 * @method POST
 */
export const update = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { name, description, id } = req.body;

  // value valid
  const updateDate = {};
  if (!valid.isEmpty(name)) updateDate['name'] = name;
  if (!valid.isEmpty(description)) updateDate['description'] = description;
  if (valid.isEmpty(id)) {
    next(createError(403, 'Warning! Missing "id" field!!!'));
    return;
  }

  const repository = dataSource.getRepository(Issue);
  const issue = await repository.findOneBy({ id, reporter: req['currentUser'] });

  if (!issue) {
    res.status(403).json({
      code: -1,
      message: 'Issue does not exist!!!',
    });
    return;
  }

  await repository.update(id, { ...updateDate });

  res.status(200).json({
    code: 0,
    msg: `issue '${issue.name}' has been updated!!!`,
  });
  return;
};
