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

@NuclearModel()
class MyClass {
  @NuclearField({ type: StringType, nullable: false })
  field;

  @NuclearField({ type: IntegerType })
  field2;

  @NuclearField({ type: IntegerType })
  field3 = () => 3;

  constructor() {
    console.log('Constructor');
  }

  @NuclearInit
  myInit() {
    console.log('My Init');
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

console.log(JSON.stringify(x));
