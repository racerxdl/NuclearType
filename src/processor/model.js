/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */

import { AbstractType } from '../types/NuclearType';

const buildModel = (target) => {
  Object.keys(target.__nuclearFields).forEach((k) => {
    Object.defineProperty(target, k, {
      get: () => 'huebr',
      set: () => {},
    });
  });
};

export const NuclearModel = (target) => {
  const w = {};
  w[target.name] = class extends target {
    constructor(...args) {
      super();
      buildModel(this);
      if (typeof this.__nuclearInit === 'function') {
        this.__nuclearInit(args);
      }
    }
  };

  Object.defineProperty(w[target.name], 'name', { value: target.name }); // Recover class name

  return w[target.name];
};

export const NuclearInit = (target, key, descriptor) => {
  target.__nuclearInit = descriptor.value;
};

export const NuclearField = ({ type, data, nullable }) => function decorator(target, key, descriptor) {

  if (!(type.prototype instanceof AbstractType)) {
    throw new Error(`Class '${type.name}' specified in field 'type' does not extends AbstractType`);
  }
  descriptor.configurable = true;

  target.__nuclearFields = target.__nuclearFields || {};
  target.__nuclearFields[key] = {
    type,
    data,
    nullable,
    __internals: {
      key,
    },
  };
};
