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

  setRecipients(recipients: string[]): NodeMailer {
    // TODO: Remove duplicates
    this.recipients.concat(recipients);
    return this;
  }

  addRecipient(recipient: string): NodeMailer {
    if (this.recipients.includes(recipient.toLowerCase())) {
      return this;
    }
    this.recipients.push(recipient);
    return this;
  }

  removeRecipient(recipient: string): NodeMailer {
    if (this.recipients.includes(recipient.toLowerCase())) {
      this.recipients = this.recipients.filter(
        (r) => r.toLowerCase() !== recipient.toLowerCase()
      );
      return this;
    }
    return this;
  }

  setSubject(subject: string): NodeMailer {
    this.subject = subject;
    return this;
  }

  setContent(type: "html" | "text", body: string): NodeMailer {
    this.type = type;
    this.body = body;
    return this;
  }

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
      // Use logger to log error
      console.error(err);
      throw err;
    }
  }
}
