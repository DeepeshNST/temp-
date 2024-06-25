const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const app = require('../../build/src/index'); // Adjust the path if necessary

const { expect } = chai;

chai.use(chaiHttp);

describe('Express Server', () => {
  // Clean up log file before each test
  beforeEach((done) => {
    fs.writeFile(path.join(__dirname, '../public', 'request.txt'), '', done);
  });

  it('should log requests to request.txt', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if (err) return done(err);
        fs.readFile(path.join(__dirname, '../public', 'request.txt'), 'utf8', (err, data) => {
          if (err) return done(err);
          expect(data).to.contain('GET /');
          done();
        });
      });
  });

  it('should return a welcome message on GET /', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Welcome');
        done();
      });
  });

  it('should return a greeting message on POST /user with valid data', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'John', age: 30 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('message', 'Hello, John! You are 30 years old.');
        done();
      });
  });

  it('should return an error on POST /user with missing data', (done) => {
    chai.request(app)
      .post('/user')
      .send({ name: 'John' })
      .end((err, res) => {
        if (err) return done(err);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error', 'Name and age are required');
        done();
      });
  });
});
