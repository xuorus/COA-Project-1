const chai = require('chai');
const sinon = require('sinon');
const pool = require('../config/db');
const { uploadScannedDocument } = require('../controllers/scanController');

const { expect } = chai;

describe('uploadScannedDocument', () => {
    let req, res, clientStub;

    beforeEach(() => {
        // Setup request mock
        req = {
            body: {
                pid: '123',
                type: 'PDS',
                data: 'base64EncodedData'
            }
        };

        // Setup response mock
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub()
        };

        // Setup database client mock
        clientStub = {
            query: sinon.stub(),
            release: sinon.stub()
        };

        // Stub pool.connect to return the mock client
        sinon.stub(pool, 'connect').resolves(clientStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should handle missing fields', async () => {
        req.body = {}; // Missing required fields
        await uploadScannedDocument(req, res);
        
        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'Missing required fields'
        })).to.be.true;
    });

    it('should handle invalid document type', async () => {
        req.body.type = 'INVALID';
        await uploadScannedDocument(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'Invalid document type: INVALID'
        })).to.be.true;
    });

    it('should handle successful upload', async () => {
        // Mock successful database queries
        clientStub.query.withArgs('BEGIN').resolves();
        clientStub.query.withArgs(
            'INSERT INTO pds (PDSfile) VALUES ($1) RETURNING pdsID',
            [sinon.match.string]
        ).resolves({ rows: [{ pdsid: 1 }] });
        clientStub.query.withArgs(
            'UPDATE person SET pdsID = $1 WHERE PID = $2',
            [1, 123]
        ).resolves();
        clientStub.query.withArgs('COMMIT').resolves();

        await uploadScannedDocument(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith({
            success: true,
            message: 'PDS document uploaded successfully',
            documentId: 1
        })).to.be.true;
        expect(clientStub.release.calledOnce).to.be.true; // Ensure release is called
    });

    it('should handle database error and rollback', async () => {
        // Mock database error
        clientStub.query.withArgs('BEGIN').resolves();
        clientStub.query.withArgs(
            'INSERT INTO pds (PDSfile) VALUES ($1) RETURNING pdsID',
            [sinon.match.string]
        ).rejects(new Error('Database error'));

        await uploadScannedDocument(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'Database error'
        })).to.be.true;
        expect(clientStub.query.calledWith('ROLLBACK')).to.be.true;
        expect(clientStub.release.calledOnce).to.be.true;
    });

    it('should handle database connection failure', async () => {
        // Simulate pool.connect() failure
        pool.connect.rejects(new Error('Connection failed'));

        await uploadScannedDocument(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWith({
            success: false,
            message: 'Database connection error'
        })).to.be.true;
    });
});
