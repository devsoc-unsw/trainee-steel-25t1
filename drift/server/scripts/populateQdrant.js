// One-time script to populate Qdrant Cloud with knowledge base
require('dotenv').config();
const { addDocs } = require('../dist/utils/chromaRAG');

async function populateKnowledgeBase() {
  try {
    console.log('🚀 Starting knowledge base population...');
    await addDocs();
    console.log('✅ Knowledge base populated successfully!');
    console.log('🎯 Your RAG system is now ready!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to populate knowledge base:', error);
    process.exit(1);
  }
}

populateKnowledgeBase(); 