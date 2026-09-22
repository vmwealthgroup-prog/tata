'use client';

import { useState } from 'react';

export default function Page() {
  const [active, setActive] = useState(false);
  return <button onClick={() => setActive(!active)}>Toggle</button>;
}
