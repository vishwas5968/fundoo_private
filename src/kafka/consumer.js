// import { kafka } from './client.js';

/* export async function consumerInit() {
  const consumer = kafka.consumer({ groupId: 'user-1' });
  await consumer.connect();
  await consumer.subscribe({ topics: ['user'], fromBeginning: false });
  let storedData = [];
  const data = await consumer.run({
    eachMessage: ({ topic, partition, message }) => {
      const data = {
        value: message.value.toString(),
        topic,
        partition
      };
      console.log('data inside consumer.run function:',data);
      console.log({partition,offset: message.offset,value: message.value.toString(),
      })
    }
  });
  console.log('data inside consumer function:',data);
  return data
} */

// export async function consumerInit() {
//   const consumer = kafka.consumer({ groupId: 'user-1' });
//   await consumer.connect();
//   await consumer.subscribe({ topics: ['user'], fromBeginning: false });
//   let storedData = [];

//   // Create a promise to resolve when all messages are consumed
//   const consumePromise = new Promise((resolve, reject) => {
//     consumer.run({
//       eachMessage: async ({ topic, partition, message }) => {
//         const data = {
//           value: message.value.toString(),
//           topic,
//           partition
//         };
//         storedData.push(data);
//         console.log('Received message:', data);
//       }
//     })
//     .then(() => resolve(storedData))
//     .catch(reject);
//   });

//   // Wait for all messages to be consumed and return the result
//   const result = await consumePromise;
//   console.log('Data received:', result);
//   return result;
// }


const { kafka } = require('./client');
import { EventEmitter } from 'events';

export async function consumerInit() {
  // const kafka = new Kafka({ brokers: ['localhost:9092'] });
  const consumer = kafka.consumer({ groupId: 'user-1' });
  const emitter = new EventEmitter();
  
  await consumer.connect();
  await consumer.subscribe({ topics: ['user'], fromBeginning: false });

  // Listen for messages and emit 'data' event
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const data = {
        value: message.value.toString(),
        topic,
        partition
      };
      console.log('Received message:', data);
      emitter.emit('data', data);
    }
  });

  // Return promise that resolves with data
  return new Promise((resolve, reject) => {
    emitter.once('data', (data) => {
      resolve(data);
    });
    // Set timeout to reject promise if no data received after 10 seconds
    setTimeout(() => {
      reject(new Error('No data received'));
    }, 10000);
  });
}

// consumerInit()
//   .then(data => {
//     console.log('Received data:', data);
//   })
//   .catch(error => {
//     console.error('Error:', error);
//   });
