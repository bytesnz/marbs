import * as deepclone from 'lodash.clonedeep';

type Conf = { [key: string]: any };

interface MockNconfInterface {
  set(key: string, data: any): void,
  get(key: string): any,
  clone(): MockNconfInterface
}

interface MockNconfConstructor {
  new (conf: Conf): MockNconfInterface;
  (conf: Conf): MockNconfInterface;
}

const MockNconf = function MockNconf(conf: Conf): MockNconfInterface {
  if (!(this instanceof MockNconf)) {
    return new (<MockNconfConstructor>MockNconf)(conf);
  }

  this.conf = conf;
};

Object.assign(MockNconf.prototype, {
  set: function set(key: string, data: any): void {
    if (typeof data === 'undefined') {
      if (typeof this.conf[key] !== 'undefined') {
        delete this.conf[key];
      }
    } else {
      this.conf[key] = data;
    }
  },
  get: function get(key: string): any {
    return this.conf[key];
  },
  clone: function clone(): MockNconfInterface {
    const newConf = deepclone(this.conf);

    return new (<MockNconfConstructor>MockNconf)(newConf);
  }
});

export default MockNconf as MockNconfConstructor;
