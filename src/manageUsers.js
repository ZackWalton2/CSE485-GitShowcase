const { QuickDB } = require("quick.db")
const path = require('path');
const dbPath = './users.sqlite'; // specify the correct path to your database
const db = new QuickDB({ filePath: dbPath });
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function addUser() {
  let name = await askName("What is the name of the person you want to add? ");
  let age = await askAge("What is the age of the person you want to add? ");
  let year = await askYear("What year is the person you are adding? (1-4) ");
  let userObjects = { name, age, year };
  await addToDatabase("users", userObjects);
}


function getYear(year) {
  const yearMap = {
    1: "Freshman",
    2: "Sophmore",
    3: "Junior",
    4: "Senior"
  }
  return yearMap[year];
}

function askName(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (answer.trim() === '') {
        console.log(`Invalid input. ${question}`);
        resolve(askName(question)); // Recur until valid input
      } else {
        resolve(answer);
      }
    });
  });
}

function askAge(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (isNaN(answer.trim()) || answer.trim() === '' || answer.trim() < 0) {
        console.log(`Invalid input. ${question}`);
        resolve(askAge(question)); // Recur until valid input
      } else {
        resolve(answer);
      }
    });
  });
}

function askYear(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      if (!getYear(answer)) {
        console.log(`Invalid input. ${question}`);
        resolve(askYear(question)); // Recur until valid input
      } else {
        resolve(getYear(answer));
      }
    });
  });
}

function askYesNo(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      const trimmedAnswer = answer.trim().toLowerCase();
      if (trimmedAnswer === '' || (trimmedAnswer !== 'y' && trimmedAnswer !== 'n')) {
        console.log('Invalid input. Please enter y or n. ');
        resolve(askYesNo(question)); // Recur until valid input
      } else {
        resolve(trimmedAnswer); // Resolve with the valid answer
      }
    });
  });
}

async function addToDatabase(dataName, data) {
  await db.set(`${dataName}.${createId()}`, data);
}

function createId() {
  return Math.floor(100000000 + Math.random() * 900000000);
}

async function main() {
  await addUser();
  let yesno = await askYesNo("Do you want to add another user? (y/n) ");
  if (yesno === "y") {
    main();
  }
  else {
    rl.close();
  }
}



main();