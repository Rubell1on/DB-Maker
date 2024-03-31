function concat<T>(source: T[], target: T | T[]) {
  let _source: T[] = source || [];

  if (target) {
    const elements = Array.isArray(target) ? target : [target];
    _source = [..._source, ...elements];
  }

  return _source;
}

export default concat;