import { contact } from '@/data/contact.ts';
import { SocialIcon } from '@/components/icons/index.tsx';
import CopyEmailButton from '@/apps/contact/CopyEmailButton.tsx';
import '@/apps/contact/contact.css';

export default function ContactApp() {
  return (
    <div className="contact-app-container">
      <section aria-labelledby="contact-details-title">
        <h2 id="contact-details-title">Contact details</h2>
        <dl className="contact-details">
          <div>
            <dt>Email</dt>
            <dd>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <CopyEmailButton email={contact.email} />
            </dd>
          </div>
          {contact.location ? (
            <div>
              <dt>Location</dt>
              <dd>{contact.location}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section aria-labelledby="social-links-title">
        <h2 id="social-links-title">Socials</h2>
        <ul className="contact-socials">
          {contact.socials.map((social) => {
            return (
              <li key={social.url}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} (opens in new tab)`}
                >
                  <SocialIcon name={social.icon} width="16" height="16" />
                  <span>{social.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
