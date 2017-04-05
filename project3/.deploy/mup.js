module.exports = {
  servers: {
    one: {
      host: '162.243.111.226',
      username: 'root',
      pem: '~/.ssh/id_rsa',
    }
  },

  meteor: {
    name: 'csc545-project3',
    path: '../app',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'http://162.243.111.226',
      PORT: 4044,
    },

    docker: {
      image: 'abernix/meteord:base',
    },

    deployCheckWaitTime: 90,

    enableUploadProgressBar: true
  },

  mongo: {
    port: 27017,
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
