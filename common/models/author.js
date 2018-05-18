'use strict';
const loopbackUtils = require('loopback/lib/utils');

module.exports = function(Author) {
  Author.remoteMethod(
    'addFriend', {
      http: {
        path: '/addFriend',
        verb: 'post',
      },

      accepts: [{
        arg: 'author',
        type: 'number',
      }, {
        arg: 'friend',
        type: ['number'],
      }],

      returns: {
        arg: 'result',
        type: 'object',
      },
    }
  );

  Author.addFriend = function(author, friend) {
    return Author.findById(author)
      .then((res) => {
        const updated = res;
        updated.friendIds.push(friend);
        return updated.save();
      }).then((res) => {});
  };

  Author.remoteMethod('searchByName', {
    accepts: [
      {arg: 'filter', type: 'object', description:
          'Filter defining fields, where, include, order, offset, and limit - must be a ' +
          'JSON-encoded string ({"something":"value"})'},
      {arg: 'p1', type: 'object', description: ''},
      {arg: 'p2', type: 'object', description: ''},
    ],
    returns: {arg: 'result', type: 'array', root: true},
    http: {path: '/', verb: 'get'},
  });

  Author.searchByName = function searchByName(filter, p1, p2, cb) {
    if (filter) {
      Author.find({where: {firstName: filter.name}}, (err, resp) => {
        cb(null, resp);
      });
    } else {
      cb(null, []);
    }
  };
};
