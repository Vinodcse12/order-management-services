import crypto from 'crypto';
import util from './util';

exports.encrypt = function (input, password) {
    var key = util.generateKey(password);
    var initializationVector = util.generateInitializationVector(key, password);

    var data = new Buffer(input.toString(), 'utf8').toString('binary');

    var cipher = crypto.createCipheriv('aes-256-cbc', key, initializationVector.slice(0,16));
    var encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');   
    var encoded = new Buffer(encrypted, 'binary').toString('base64');

    return encoded;
}