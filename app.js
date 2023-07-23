const _ = require('lodash');
const { generateRandomTimetable, calculateFitness, crossover, mutate } = require('./ga');
const { insertTimetable, getTimetables, closeDatabase } = require('./index');

const POPULATION_SIZE = 100;
const MAX_GENERATIONS = 1000;

// Function to run the genetic algorithm
async function runGeneticAlgorithm(subjects, teachers, rooms, days, times) {
    let generation = 1;
    let population = [];

    // Generate the initial population
    for (let i = 0; i < POPULATION_SIZE; i++) {
        const timetable = generateRandomTimetable(subjects, teachers, rooms, days, times);
        population.push(timetable);
    }

    while (generation <= MAX_GENERATIONS) {
        console.log(`Generation: ${generation}`);

        // Calculate fitness for each timetable in the population
        for (const timetable of population) {
            timetable.fitness = calculateFitness(timetable);
        }

        // Sort the population by fitness in ascending order
        population = _.sortBy(population, 'fitness');

        // If you've reached a satisfactory fitness score, you can break the loop here

        // Perform crossover and mutation to create a new generation
        const newGeneration = [];

        // Keep the best 10% of timetables (elitism)
        const elitismOffset = Math.floor(0.1 * POPULATION_SIZE);
        newGeneration.push(...population.slice(0, elitismOffset));

        while (newGeneration.length < POPULATION_SIZE) {
            // Perform crossover between two random timetables from the current population
            const parent1 = _.sample(population);
            const parent2 = _.sample(population);
            const child = crossover(parent1, parent2);

            // Perform mutation on the child timetable
            const mutatedChild = mutate(child);

            newGeneration.push(mutatedChild);
        }

        // Replace the old population with the new generation
        population = newGeneration;

        // Increment generation counter
        generation++;
    }

    // Store the final timetables in the database
    for (const timetable of population) {
        await insertTimetable(timetable);
    }

    console.log('Genetic Algorithm completed!');
    closeDatabase();
}

// Replace these example arrays with your actual data
const subjects = ['Math', 'Science', 'History', 'English'];
const teachers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Brown'];
const rooms = ['Room A', 'Room B', 'Room C'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = ['8:00 AM', '10:00 AM', '1:00 PM', '3:00 PM'];

runGeneticAlgorithm(subjects, teachers, rooms, days, times);