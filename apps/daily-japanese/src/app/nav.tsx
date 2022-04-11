import classNames from 'classnames';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './nav.scss';

interface NavProps {
  links: { name: string; link: string }[];
}

export function Nav({ links }: NavProps) {
  const [navOpen, setNavOpen] = useState(false);

  const location = useLocation();
  const activeGroup = links.find((x) => x.link === location.pathname);

  return (
    <nav className="menu">
      <div className="cursor-pointer" onClick={() => setNavOpen(true)}>
        &gt;&gt; {activeGroup?.name} &lt;&lt;
      </div>
      <ul
        className={classNames('links', { open: navOpen })}
        onClick={() => setNavOpen(false)}
      >
        {links.map((group) => (
          <li
            key={group.link}
            className={activeGroup?.link === group.link ? 'font-bold' : ''}
          >
            <Link to={group.link}>{group.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
