import { about } from '@/data/index.ts';
import defaultAvatar from '@/assets/default-avatar.png';
import '@/apps/about/about.css';

export default function AboutApp() {
  return (
    <div className="about-app-container">
      <ul className="tree-view">
        <li>{about.name}</li>
        <ul>
          <li>{about.role}</li>
        </ul>
        <ul>
          <li>{about.summary}</li>
        </ul>
      </ul>
      <img
        src={about.avatar ?? defaultAvatar}
        alt={about.name + ' photo'}
        width="100"
        height="auto"
      />
    </div>
  );
}
