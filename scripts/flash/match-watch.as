this.watch = function(property, callback, userData)
{
   var running = false;
   var guarded = function(id, oldValue, newValue, data)
   {
      if (running) return newValue;
      running = true;
      var result = callback.call(this, id, oldValue, newValue, data);
      running = false;
      return result;
   };
   return Object.prototype.watch.call(this, property, guarded, userData);
};
this.init();
this.stop();
