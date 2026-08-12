import { cv } from '@/data/index.ts';
import '@/apps/cv/cv.css';

function formatPeriod(startDate: string, endDate?: string) {
  return `${startDate} - ${endDate ?? 'Present'}`;
}

export default function Cv() {
  return (
    <main className="cv-content">
      <section aria-labelledby="cv-about-heading">
        <fieldset>
          <legend id="cv-about-heading">
            <span role="heading" aria-level={2}>
              About
            </span>
          </legend>
          <div className="cv-about">
            <div>
              <h1>{cv.about.name}</h1>
              <p className="cv-role">{cv.about.role}</p>
              <p className="cv-summary">{cv.about.summary}</p>
            </div>
            {cv.about.avatar && (
              <img
                className="cv-avatar"
                src={cv.about.avatar}
                alt={`${cv.about.name} photo`}
                width="100"
                height="100"
              />
            )}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="cv-contact-heading">
        <fieldset>
          <legend id="cv-contact-heading">
            <span role="heading" aria-level={2}>
              Contact
            </span>
          </legend>
          <address className="cv-contact">
            <div>
              <strong>Email:</strong>{' '}
              <a href={`mailto:${cv.contact.email}`}>{cv.contact.email}</a>
            </div>
            {cv.contact.location && (
              <div>
                <strong>Location:</strong> {cv.contact.location}
              </div>
            )}
            {cv.contact.socials.map((social) => (
              <div key={social.url}>
                <strong>{social.label}:</strong>{' '}
                <a href={social.url}>{social.url}</a>
              </div>
            ))}
          </address>
        </fieldset>
      </section>

      <section aria-labelledby="cv-experience-heading">
        <fieldset>
          <legend id="cv-experience-heading">
            <span role="heading" aria-level={2}>
              Experience
            </span>
          </legend>
          <div className="cv-entry-list">
            {cv.experience.map((entry) => (
              <article
                className="cv-entry"
                key={`${entry.organization}-${entry.title}`}
              >
                <h3>{entry.title}</h3>
                <p className="cv-entry-meta">
                  <strong>{entry.organization}</strong> |{' '}
                  {formatPeriod(entry.period.startDate, entry.period.endDate)}
                  {entry.location && ` | ${entry.location}`}
                </p>
                <p>{entry.description}</p>
                <ul>
                  {entry.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="cv-education-heading">
        <fieldset>
          <legend id="cv-education-heading">
            <span role="heading" aria-level={2}>
              Education
            </span>
          </legend>
          <div className="cv-entry-list">
            {cv.education.map((entry) => (
              <article
                className="cv-entry"
                key={`${entry.organization}-${entry.title}`}
              >
                <h3>{entry.title}</h3>
                <p className="cv-entry-meta">
                  <strong>{entry.organization}</strong> |{' '}
                  {formatPeriod(entry.period.startDate, entry.period.endDate)}
                </p>
              </article>
            ))}
          </div>
        </fieldset>
      </section>

      <section aria-labelledby="cv-skills-heading">
        <fieldset>
          <legend id="cv-skills-heading">
            <span role="heading" aria-level={2}>
              Skills
            </span>
          </legend>
          <div className="cv-skills">
            {cv.skills.map((group) => (
              <section
                key={group.category}
                aria-labelledby={`skill-${group.category}`}
              >
                <h3 id={`skill-${group.category}`}>{group.category}</h3>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill.name}>
                      {skill.name}
                      {skill.level && <span> ({skill.level})</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </fieldset>
      </section>
    </main>
  );
}
