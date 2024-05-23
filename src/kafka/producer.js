import { kafka } from './client.js';
import { consumerInit } from './consumer.js';

export const producerInit = async (req,next) =>{
    const producer = kafka.producer();
    await producer.connect();
    console.log('connecting');
    const data = await producer.send({
      topic: "user",
      messages: [{
        partition: 0,
        key: 'name',
        value: JSON.stringify(req.body)
      }]
    });
    console.log('disconnecting');
    await producer.disconnect();
    // await consumerInit();
  // await producer.disconnect()
}