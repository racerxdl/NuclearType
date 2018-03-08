/**
 * Created by Lucas Teske on 08/03/18.
 * @flow
 */
import {
  NuclearModel,
  NuclearField,
  NuclearInit,
} from './processor';
import {
  StringType,
  IntegerType,
} from './types/NuclearType';

@NuclearModel
class MyClass {
  @NuclearField({ type: StringType })
  field;

  @NuclearField({ type: IntegerType })
  field2;

  constructor() {
    console.log('Constructor');
  }

  @NuclearInit
  myInit() {
    console.log('My Init');
  }
}


const x = new MyClass();

console.log(JSON.stringify(x));