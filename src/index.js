/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */
import { printSchema, GraphQLSchema } from 'graphql';
import {
  NuclearModel,
  NuclearField,
  NuclearInit,
} from './processor';
import {
  StringType,
  IntegerType,
} from './types/NuclearType';

@NuclearModel({ name: 'HUEBRClass' })
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
/*
console.debug(MyClass.____graphQL);

console.debug(x.GraphQL);
*/
const schema = new GraphQLSchema({
  query: MyClass.GraphQL,
});

console.log(MyClass.Sequelize);

console.log(printSchema(schema));

// console.log(JSON.stringify(x));
