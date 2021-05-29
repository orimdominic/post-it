import nodemailer, { SentMessageInfo } from "nodemailer";
import MailService from "./MailService";

// TODO: Extract strings to constants
// TODO: Add docs
// TODO: Add tests

export default class NodeMailer implements MailService {
  private transporter;
  private type: "html" | "text" | undefined;
  private subject: string | undefined;
  private body: string | undefined;
  private recipients: string[];

  /**
   * @param {string} email The sender email
   * @param {string} password The password for the sender email
   */
  constructor(private email: string, private password: string) {
    this.transporter = nodemailer.createTransport({
      port: 465,
      host: "smtp.gmail.com",
      service: "gmail",
      secure: true,
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
    this.recipients = [];
  }

  /**
   * Add a set of recipients for the mail
   * @param {string []} recipients
   * @returns {NodeMailer} this object
   */
  setRecipients(recipients: string[]): NodeMailer {
    this.recipients.concat(recipients);
    // TODO: Remove duplicates
    this.recipients = [...new Set(this.recipients)];
    return this;
  }

  /**
   * Add a recipient to the recipient set for the mail
   * @param {string } recipient
   * @returns {NodeMailer} this object
   */
  addRecipient(recipient: string): NodeMailer {
    if (this.recipients.includes(recipient.toLowerCase())) {
      return this;
    }
    this.recipients.push(recipient);
    return this;
  }

  /**
   * Remove a recipient from the recipient set for the mail
   * @param {string } recipient
   * @returns {NodeMailer} this object
   */
  removeRecipient(recipient: string): NodeMailer {
    if (this.recipients.includes(recipient.toLowerCase())) {
      this.recipients = this.recipients.filter(
        (r) => r.toLowerCase() !== recipient.toLowerCase()
      );
      return this;
    }
    return this;
  }

  /**
   * Set the subject of the mail the mail
   * @param {string } subject
   * @returns {NodeMailer} this object
   */
  setSubject(subject: string): NodeMailer {
    this.subject = subject;
    return this;
  }

  /**
   * Set the content and type of the mail
   * @param {string } subject
   * @returns {NodeMailer} this object
   */
  setContent(type: "html" | "text", body: string): NodeMailer {
    this.type = type;
    this.body = body;
    return this;
  }

  /**
   * Validate that all necessary params are set before sending a mail
   */
  private validateParamsBeforeSending(): void {
    if (!this.type) {
      throw new Error("Email has no set type");
    }
    if (!this.subject) {
      throw new Error("Email has no subject");
    }
    if (!this.body) {
      throw new Error("Mail has no body");
    }
    if (!this.type?.length) {
      throw new Error("Mail has no recipient");
    }
  }

  private getContentConfig() {
    return this.type === "html"
      ? {
          html: this.body,
        }
      : {
          text: this.body,
        };
  }

  /**
   * Send the mail
   * @returns Promise<SentMessageInfo> information about the mail
   */
  async send(): Promise<SentMessageInfo> {
    try {
      this.validateParamsBeforeSending();
      const info = await this.transporter.sendMail({
        from: this.email,
        to: this.recipients.join(),
        subject: this.subject,
        ...this.getContentConfig(),
      });
      return info;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
