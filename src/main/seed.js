const {db} = require('./schema');

const problems = [
    {
        title: 'Square Number',
        difficulty: 'Easy',
        description: 'Given a number return the sqaure of that number'
    },
    {
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.'
    },
    
 {
        title: 'Binary Search',
        difficulty: 'easy',
        description: 'Given a sorted array, find the index of a target element.'
    },
    {
        title: 'Merge Sort',
        difficulty: 'medium',
        description: 'Sort an array using the merge sort algorithm.'
    }
    
];
const testCases =  [
    { problem_id: 1, input: '6\n', expected_output: '36\n', is_sample: 1 },
    { problem_id: 1, input: '3\n', expected_output: '9\n', is_sample: 1 },
    { problem_id: 1, input: '10\n', expected_output: '100\n', is_sample: 1 },
];


const insert = db.prepare('INSERT INTO problems (title,difficulty,description) VALUES (?,?,?)');
const insertMany = db.transaction((problems) => {
    for (const problem of problems) {
        insert.run(problem.title, problem.difficulty, problem.description);
    }
});

const insertTestCases = db.prepare('INSERT INTO test_cases (problem_id,input,expected_output,is_sample) VALUES (?,?,?,?)');
const insertOneTestCase = db.transaction((test_cases)=>{
    for(const test_case of test_cases){
        insertTestCases.run(test_case.problem_id,test_case.input,test_case.expected_output,test_case.is_sample);
    }
})

insertMany(problems);
insertOneTestCase(testCases);
console.log('Database seeded successfully!');
