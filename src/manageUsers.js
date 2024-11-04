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
  rl.close();
  console.log(name, age, year);
}


function getYear(year) {
  const yearMap = {
    0: "Freshman",
    1: "Sophmore",
    2: "Junior",
    3: "Senior"
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
      let year = getYear(answer);
      if (!getYear(answer)) {
        console.log(`Invalid input. ${question}`);
        resolve(askYear(question)); // Recur until valid input
      } else {
        resolve(getYear(answer));
      }
    });
  });
}

async function main() {
  await addUser();
}

main();