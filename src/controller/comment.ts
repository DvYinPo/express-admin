import { Request, Response, NextFunction, RequestHandler } from 'express';
import createError from 'http-errors';
import { dataSource } from '../database';
import { Comment } from '../model';
import { valid } from '../util';

/**
 * 查询评论
 * @route '/comment'
 */
export const index = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const repository = dataSource.getRepository(Comment);
  const comment = await repository.find({
    where: {
      owner: req['currentUser'],
    },
    relations: {
      issue: true,
      project: true,
    },
  });

  res.status(200).json({
    code: 0,
    message: 'query success!!!',
    owner: req['currentUser'],
    data: {
      comment,
    },
  });
  return;
};

/**
 * 创建项目
 * @param req.body.content string
 * @param req.body.description string
 * @method POST
 */
export const create = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { content } = req.body;
  const repository = dataSource.getRepository(Comment);

  const comment = await repository.findOneBy({ content, owner: req['currentUser'] });

  if (!!comment) {
    res.status(403).json({
      code: -1,
      message: 'Comment already exists!!!',
      comment,
    });
    return;
  }

  await repository.insert({
    content,
    owner: req['currentUser'],
  });

  res.status(200).json({
    code: 0,
    msg: `content created successful!!!`,
    comment,
  });
  return;
};

/**
 * 更新项目
 * @param req.body.name string
 * @param req.body.description string
 * @param req.body.id number
 * @method POST
 */
export const update = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { content, id } = req.body;

  // value valid
  const updateDate = {};
  if (!valid.isEmpty(content)) updateDate['name'] = content;
  if (valid.isEmpty(id)) {
    next(createError(403, 'Warning! Missing "id" field!!!'));
    return;
  }

  const repository = dataSource.getRepository(Comment);
  const comment = await repository.findOneBy({ id, owner: req['currentUser'] });

  if (!comment) {
    res.status(403).json({
      code: -1,
      message: 'comment does not exist!!!',
    });
    return;
  }

  await repository.update(id, { ...updateDate });

  res.status(200).json({
    code: 0,
    msg: `comment has been updated!!!`,
  });
  return;
};
