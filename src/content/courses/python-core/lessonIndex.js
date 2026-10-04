import welcome from "./lessons/01-welcome.js";
import readingErrors from "./lessons/reading-errors.js";
import variablesAndTypes from "./lessons/02-variables-and-types.js";
import inputAndOutput from "./lessons/input-and-output.js";

import numbersAndMath from "./lessons/numbers-and-math.js";
import stringsBasics from "./lessons/strings-basics.js";
import fstringsAndFormatting from "./lessons/fstrings-and-formatting.js";
import stringMethods from "./lessons/10-string-methods.js";
import booleansAndComparisons from "./lessons/booleans-and-comparisons.js";

import controlFlow from "./lessons/04-control-flow.js";
import conditionsInDepth from "./lessons/conditions-in-depth.js";
import matchAndTernary from "./lessons/match-and-ternary.js";
import reviewVariablesControlFlow from "./lessons/review-variables-control-flow.js";

import loops from "./lessons/05-loops.js";
import whileLoops from "./lessons/while-loops.js";
import nestedLoops from "./lessons/nested-loops.js";
import loopPatterns from "./lessons/loop-patterns.js";
import reviewLoops from "./lessons/review-loops.js";

import lists from "./lessons/06-lists.js";
import listMethods from "./lessons/list-methods.js";
import tuplesAndUnpacking from "./lessons/tuples-and-unpacking.js";
import sets from "./lessons/sets.js";
import dictionaries from "./lessons/07-dictionaries.js";
import dictMethods from "./lessons/dict-methods.js";
import nestedData from "./lessons/nested-data.js";
import reviewCollections from "./lessons/review-collections.js";

import functions from "./lessons/09-functions.js";
import parametersAndDefaults from "./lessons/parameters-and-defaults.js";
import scope from "./lessons/scope.js";
import argsAndKwargs from "./lessons/args-and-kwargs.js";
import recursion from "./lessons/recursion.js";
import lambdaAndHigherOrder from "./lessons/lambda-and-higher-order.js";
import reviewFunctions from "./lessons/review-functions.js";

import listComprehensions from "./lessons/14-list-comprehensions.js";
import dictAndSetComprehensions from "./lessons/dict-and-set-comprehensions.js";
import iteratorsAndGenerators from "./lessons/iterators-and-generators.js";
import anyAllAggregates from "./lessons/any-all-aggregates.js";

import errorHandling from "./lessons/11-error-handling.js";
import raisingExceptions from "./lessons/raising-exceptions.js";
import files from "./lessons/files.js";
import processingTextData from "./lessons/processing-text-data.js";

import classesAndOop from "./lessons/13-classes-and-oop.js";
import attributesAndMethods from "./lessons/attributes-and-methods.js";
import specialMethods from "./lessons/special-methods.js";
import inheritance from "./lessons/inheritance.js";
import compositionAndPolymorphism from "./lessons/composition-and-polymorphism.js";
import properties from "./lessons/properties.js";
import dataclasses from "./lessons/dataclasses.js";
import reviewOop from "./lessons/review-oop.js";

import modulesAndImports from "./lessons/12-modules-and-imports.js";
import mathRandomStatistics from "./lessons/math-random-statistics.js";
import collectionsModule from "./lessons/collections-module.js";
import itertoolsFunctools from "./lessons/itertools-functools.js";
import datetimeModule from "./lessons/datetime-module.js";
import jsonModule from "./lessons/json-module.js";
import regularExpressions from "./lessons/regular-expressions.js";

import decorators from "./lessons/decorators.js";
import testingWithAssert from "./lessons/testing-with-assert.js";
import styleAndIdioms from "./lessons/style-and-idioms.js";

import projectTodoManager from "./lessons/project-todo-manager.js";
import projectWordCounter from "./lessons/project-word-counter.js";
import projectBankAccount from "./lessons/project-bank-account.js";
import projectContactBook from "./lessons/project-contact-book.js";
import projectInventory from "./lessons/project-inventory.js";
import projectTextAdventure from "./lessons/project-text-adventure.js";

const unit1 = [welcome, readingErrors, variablesAndTypes, inputAndOutput];
const unit2 = [
  numbersAndMath,
  stringsBasics,
  fstringsAndFormatting,
  stringMethods,
  booleansAndComparisons,
];
const unit3 = [
  controlFlow,
  conditionsInDepth,
  matchAndTernary,
  reviewVariablesControlFlow,
];
const unit4 = [loops, whileLoops, nestedLoops, loopPatterns, reviewLoops];
const unit5 = [
  lists,
  listMethods,
  tuplesAndUnpacking,
  sets,
  dictionaries,
  dictMethods,
  nestedData,
  reviewCollections,
];
const unit6 = [
  functions,
  parametersAndDefaults,
  scope,
  argsAndKwargs,
  recursion,
  lambdaAndHigherOrder,
  reviewFunctions,
];
const unit7 = [
  listComprehensions,
  dictAndSetComprehensions,
  iteratorsAndGenerators,
  anyAllAggregates,
];
const unit8 = [errorHandling, raisingExceptions, files, processingTextData];
const unit9 = [
  classesAndOop,
  attributesAndMethods,
  specialMethods,
  inheritance,
  compositionAndPolymorphism,
  properties,
  dataclasses,
  reviewOop,
];
const unit10 = [
  modulesAndImports,
  mathRandomStatistics,
  collectionsModule,
  itertoolsFunctools,
  datetimeModule,
  jsonModule,
  regularExpressions,
];
const unit11 = [decorators, testingWithAssert, styleAndIdioms];
const unit12 = [
  projectTodoManager,
  projectWordCounter,
  projectBankAccount,
  projectContactBook,
  projectInventory,
  projectTextAdventure,
];

export const lessons = [
  ...unit1,
  ...unit2,
  ...unit3,
  ...unit4,
  ...unit5,
  ...unit6,
  ...unit7,
  ...unit8,
  ...unit9,
  ...unit10,
  ...unit11,
  ...unit12,
];
