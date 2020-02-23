import crypto from 'crypto';

exports.generateKey = function(password) {    
    var cryptographicHash = crypto.createHash('md5');
    cryptographicHash.update(password);
    var key = cryptographicHash.digest('hex');

    return key;
};

exports.generateInitializationVector = function(key, password) {
    var cryptographicHash = crypto.createHash('md5');
    cryptographicHash.update(password + key);
    var initializationVector = cryptographicHash.digest('hex');

    return initializationVector;
};