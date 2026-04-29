export function appBasePath() {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/') {
    return '';
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
}

export function appExternalPath(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const base = appBasePath();
  if (!base || normalizedPath === base || normalizedPath.startsWith(`${base}/`)) {
    return normalizedPath;
  }
  return `${base}${normalizedPath}`;
}

export function routerBasename() {
  return appBasePath() || undefined;
}
