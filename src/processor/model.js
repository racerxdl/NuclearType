/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */

import {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLNonNull,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { AbstractType } from '../types/NuclearType';

const buildModel = (target) => {
  // region Output GraphQL
  const graphQLOutputFields = {
    gid: globalIdField(target.___graphQL.name),
  };

  // endregion
  // region Input GraphQL
  const graphQLInputFields = {};
  // endregion

  Object.keys(target.__nuclearFields).forEach((k) => {
    const fieldData = target.__nuclearFields[k];
    let baseType;

    // region Resolve Base Type
    if (fieldData.type.prototype instanceof AbstractType) {
      const Type = fieldData.type;
      baseType = new Type();
    } else {
      baseType = fieldData.type;
    }
    // endregion
    // region Resolve GraphQL Type
    const baseOutGraphQLType = baseType._graphQLType || baseType.GraphQL;
    const baseInGraphQLType = baseType._graphQLType || baseType.GraphQLInput;

    const gOutType = fieldData.nullable ? baseOutGraphQLType : new GraphQLNonNull(baseOutGraphQLType);
    const gInType = fieldData.nullable ? baseInGraphQLType : new GraphQLNonNull(baseInGraphQLType);

    const initializer = typeof fieldData.initializer === 'function' ? fieldData.initializer() : null;
    // endregion

    graphQLOutputFields[k] = {
      type: gOutType,
      description: fieldData.graphqlDescription || `Auto generated field ${k}`,
    };

    graphQLInputFields[k] = {
      type: gInType,
      description: fieldData.graphqlDescription || `Auto generated field ${k}`,
    };

    if (typeof initializer === 'function') {
      graphQLOutputFields[k].resolve = initializer;
    }
    /*
    Object.defineProperty(target, k, {
      get: () => 'huebr',
      set: () => {},
    });
    */
  });

  const graphQLOutput = {
    name: target.___graphQL.name,
    description: target.___graphQL.description,
    fields: () => graphQLOutputFields,
  };

  const graphQLInput = {
    name: target.___graphQL.name,
    description: target.___graphQL.description,
    fields: () => graphQLInputFields,
  };

  console.log('Output', JSON.stringify(graphQLOutput.fields(), null, 2));
  console.log('Input', JSON.stringify(graphQLInput.fields(), null, 2));

  target.GraphQL = new GraphQLObjectType(graphQLOutput);
  target.GraphQLInput = new GraphQLInputObjectType(graphQLInput);
};

export const NuclearModel = ({ name = null, description = null } = { name: null, description: null }) => (target) => {
  const w = {};
  if (!target) {
    throw new Error('Please use @NuclearModel() instead of @NuclearModel');
  }
  w[target.name] = class extends target {
      static ___nuclearModel = true;

      static ___graphQL = {
        name: name || target.name,
        description: description || `Auto Generated Class ${target.name}`,
      };

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

export const NuclearField = ({
  type, data, nullable = true, graphqlDescription,
}) => (target, key, descriptor) => {
  if (!(type.prototype instanceof AbstractType) && !type.___nuclearModel) {
    throw new Error(`Class '${type.name}' specified in field 'type' does not extends AbstractType`);
  }
  descriptor.configurable = true;

  target.__nuclearFields = target.__nuclearFields || {};
  target.__nuclearFields[key] = {
    type,
    data,
    nullable,
    graphqlDescription,
    initializer: descriptor.initializer,
    __internals: {
      key,
    },
  };
};
