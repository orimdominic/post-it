/**
 * All mailers must implement this interface
 */
export default interface MailService {
  setRecipients: (recipients: string[]) => MailService;
  addRecipient: (recipient: string) => MailService;
  removeRecipient: (recipient: string) => MailService;
  send: () => Promise<Record<string, any>>;
  setSubject: (subject: string) => MailService;
  setContent: (type: "html" | "text", body: string) => MailService;
}
