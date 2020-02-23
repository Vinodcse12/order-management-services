import crypto from 'crypto';
import util from './util.js';

exports.decrypt = function(input, password) {
    var key = util.generateKey(password);
    var initializationVector = util.generateInitializationVector(key, password);

    var input = input.replace(/\-/g, '+').replace(/_/g, '/');
    var edata = new Buffer(input, 'base64').toString('binary');

    var decipher = crypto.createDecipheriv('aes-256-cbc', key, initializationVector.slice(0,16));
   // var decrypted = decipher.update(edata, 'binary', 'utf8');
    //console.log(decrypted)
    //decrypted += decipher.final('utf8');
    // decrypted =  Buffer.concat([
    //     decipher.update(edata, 'binary', 'utf8'),
    //     decipher.final('utf8')
    // ]);
    var decoded = new Buffer(Buffer.concat([
        decipher.update(edata, 'binary', 'utf8'),
        decipher.final('utf8')
    ]), 'binary').toString('utf8');

    return decoded;
}