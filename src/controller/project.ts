import { Request, Response, NextFunction, RequestHandler } from 'express';
import createError from 'http-errors';
import { dataSource } from '../database';
import { Project } from '../model';
import { valid } from '../util';

/**
 * 查询project
 * @returns '/project'
 */
export const index = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const repository = dataSource.getRepository(Project);

  const project = await repository.find({
    where: {
      owner: req['currentUser'],
    },
    relations: {
      issue: true,
      users: true,
      comment: true,
    },
  });

  res.status(200).json({
    code: 0,
    message: 'query success!!!',
    data: {
      project,
    },
  });
  return;
};

/**
 * 创建项目
 * @param req.body.name string
 * @param req.body.description string
 * @method POST
 */
export const create = async (req: Request, res: Response, next: NextFunction): Promise<RequestHandler> => {
  const { name, description } = req.body;
  const projectRepository = dataSource.getRepository(Project);

  const project = await projectRepository.findOneBy({ name, owner: req['currentUser'] });

  if (!!project) {
    res.status(403).json({
      code: -1,
      message: 'Project already exists!!!',
      project,
    });
    return;
  }

  await projectRepository.insert({
    name,
    description,
    owner: req['currentUser'],
  });

  res.status(200).json({
    code: 0,
    msg: `project '${name}' created successful!!!`,
    project,
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
  const { name, description, id } = req.body;

  // value valid
  const updateDate = {};
  if (!valid.isEmpty(name)) updateDate['name'] = name;
  if (!valid.isEmpty(description)) updateDate['description'] = description;
  if (valid.isEmpty(id)) {
    next(createError(403, 'Warning! Missing "id" field!!!'));
    return;
  }

  const projectRepository = dataSource.getRepository(Project);
  const project = await projectRepository.findOneBy({ id, owner: req['currentUser'] });

  if (!project) {
    res.status(403).json({
      code: -1,
      message: 'Project does not exist!!!',
    });
    return;
  }

  await projectRepository.update(id, { ...updateDate });

  res.status(200).json({
    code: 0,
    msg: `project '${project.name}' has been updated!!!`,
  });
  return;
};
