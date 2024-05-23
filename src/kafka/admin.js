
const { kafka } = require('./client');

async function init() {
  const admin = kafka.admin();
  console.log('Admin Connecting');
  await admin.connect();
  console.log('Admin Connection Success');
  await admin.createTopics({
    topics: [
      {
        topic: 'user',
        numPartitions: 1,
        replicationFactor: 0
      },
      {
        topic: 'notes',
        numPartitions: 1
      }
    ]
  });
  console.log('Topics Created');
  await admin.disconnect();
}

export default init;
