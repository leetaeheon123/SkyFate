export function isEmptyObj(obj:Object)  {
    if(obj.constructor === Object
       && Object.keys(obj).length === 0)  {
      return true;
    }
    
    return false;
  }
  