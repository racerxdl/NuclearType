/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */
import { printSchema, GraphQLSchema } from 'graphql';
import Sequelize from 'sequelize';
import {
  NuclearModel,
  NuclearField,
  NuclearInit,
} from './processor';
import {
  StringType,
  IntegerType,
} from './types/NuclearType';

const sequelize = new Sequelize('main', 'root', null, {
  host: 'localhost',
  port: 26257,
  dialect: 'postgres',
});


@NuclearModel({ name: 'HUEBRClass', version: 1, sequelize })
class MyClass {
  @NuclearField({ type: StringType, nullable: false })
  field;

  @NuclearField({ type: IntegerType, graphqlDescription: 'HUEBR' })
  field2;

  @NuclearField({ type: IntegerType })
  field3 = () => 3;

  constructor() {
    // console.log('Constructor');
  }

  @NuclearInit
  myInit(x) {
    // HUEHR
  }
}


@NuclearModel()
class MyClass2 {
  @NuclearField({ type: MyClass, nullable: false })
  field;

  @NuclearInit
  myInit() {
    console.log('My Init 2');
  }
}

const x = new MyClass();

const schema = new GraphQLSchema({
  query: MyClass.GraphQL,
});

console.log(MyClass.Sequelize);

console.log(printSchema(schema));

// console.log(JSON.stringify(x));

MyClass.Sequelize.sync().then(() => {
  return MyClass.Sequelize.create({
    field: 'huebr',
    field2: 1234,
  })
}).then((data) => {
  console.log(data);
  console.log(data.field);
});
