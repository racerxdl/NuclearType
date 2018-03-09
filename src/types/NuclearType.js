/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */

import { DataTypes } from 'sequelize';
import {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLFloat,
  GraphQLEnumType,
} from 'graphql';

export class AbstractType {
  _sequelizeType: Object;
  _graphQLType: Object;
}

export class ArrayType extends AbstractType {
  constructor(subType: AbstractType) {
    super();
    this._sequelizeType = DataTypes.ARRAY(subType._sequelizeType);
    this._graphQLType = new GraphQLList(subType._graphQLType);
  }
}

export class StringType extends AbstractType {
  options: Object;
  _binary: boolean;
  _length: number;

  /**
   * String Type
   * @param length String length (default: 255)
   * @returns {StringType}
   */
  constructor(length) {
    super();
    const options = (typeof length === 'object' && length) || { length };
    if (!(this instanceof StringType)) return new StringType(options);

    this.options = options;
    this._binary = false;
    this._length = options.length || 255;
    this._sequelizeType = DataTypes.STRING(options);
    this._graphQLType = GraphQLString;
  }
}

export class BinaryStringType extends StringType {
  /**
   * Binary String Type
   * @param length Length of the Binary string in bytes (default: 255)
   * @returns {BinaryStringType}
   */
  constructor(length) {
    super(length);
    this._binary = true;
    this.options.binary = true;
    this._sequelizeType = DataTypes.STRING.BINARY;
  }
}

export class NumberType extends AbstractType {
  /**
   * Number Abstract Class
   * @param length
   * @param zerofill
   * @param decimals
   * @param precision
   * @param scale
   * @param unsigned
   */
  constructor(length, zerofill, decimals, precision, scale, unsigned) {
    super();
    this.options = {
      length,
      zerofill,
      decimals,
      precision,
      scale,
      unsigned,
    };
    this._sequelizeType = DataTypes.NUMBER(this.options);
    this._graphQLType = GraphQLFloat;
  }
}

export class BooleanType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.BOOLEAN;
    this._graphQLType = GraphQLBoolean;
  }
}

export class IntegerType extends NumberType {
  /**
   * Integer Type
   * @param length Length in bits of the integer
   */
  constructor(length = 32) {
    let graphQLType = GraphQLInt;
    let sequelizeType = DataTypes.INTEGER;
    switch (length) {
      case 8: sequelizeType = DataTypes.TINYINT; break;
      case 16: sequelizeType = DataTypes.SMALLINT; break;
      case 24: sequelizeType = DataTypes.MEDIUMINT; break;
      case 32: sequelizeType = DataTypes.INTEGER; break;
      case 64: sequelizeType = DataTypes.BIGINT; graphQLType = GraphQLString; break;
      default:
        throw new Error(`The value ${length} is not supported as integer length. Supported values: 8, 16, 24, 32, 64`);
    }
    super(length);
    this._sequelizeType = sequelizeType;
    this._graphQLType = graphQLType;
  }
}

export class FloatType extends AbstractType {
  constructor(length) {
    super();
    this.options = { length };
    this._sequelizeType = DataTypes.FLOAT(this.options);
    this._graphQLType = GraphQLFloat;
  }
}

export class DecimalType extends AbstractType {
  constructor(precision, scale) {
    super();
    this.options = { precision, scale };
    this._sequelizeType = DataTypes.DECIMAL(precision, scale);
    this._graphQLType = GraphQLString;
  }
}

export class TimestampType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.INTEGER.UNSIGNED;
    this._graphQLType = GraphQLFloat;
  }
}

export class DateTimeType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.DATE;
    this._graphQLType = GraphQLString;
  }
}

export class DateType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.DATEONLY;
    this._graphQLType = GraphQLString;
  }
}

export class JSONType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.JSON;
    this._graphQLType = GraphQLString;
  }
}

export class EnumType extends AbstractType {
  constructor() {
    super();
    this._sequelizeType = DataTypes.ENUM;
    this._graphQLType = GraphQLEnumType;
  }
}
