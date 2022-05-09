import mongoose from 'mongoose';

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }).then(() => {
      console.log('Conectado ao MongoDB');
      },
      err => { 
          console.log('error: '+ err)
      }
    );    
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;



