import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailConfig } from '../../config/mail.config';
import { ContributionEntity } from '../contributions/entities/contribution.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: mailConfig.port,
      secure: mailConfig.secure,
      auth: mailConfig.auth,
    });
  }

  /**
   * Notification email aux admins lors d'une nouvelle contribution citoyenne.
   * Conforme à §7.6 du cahier des charges.
   */
  async sendContributionNotification(contribution: ContributionEntity): Promise<void> {
    const adminEmails = mailConfig.adminEmails;
    if (!adminEmails.length || !mailConfig.auth.user) {
      this.logger.warn('Notification email non envoyée : configuration email manquante.');
      return;
    }

    const typeLabel = contribution.type === 'idee' ? '💡 Nouvelle Idée' : '🚨 Nouveau Signalement';
    const dashboardUrl = `${process.env.APP_URL || 'http://localhost:3001'}/api/docs#/Contributions`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #062326; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #34D399; margin: 0;">InnovSahel — ${typeLabel}</h2>
          <p style="color: #94A3B8; margin: 5px 0 0;">Plateforme citoyenne du District de Bamako</p>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #E2E8F0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748B; width: 140px;"><strong>Type</strong></td>
              <td style="padding: 8px 0; color: #0F172A;">
                ${contribution.type === 'idee' ? 'Proposition d\'idée' : 'Signalement de problème'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B;"><strong>Commune</strong></td>
              <td style="padding: 8px 0; color: #0F172A;">${contribution.communeId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B;"><strong>Catégorie</strong></td>
              <td style="padding: 8px 0; color: #0F172A;">${contribution.category}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B; vertical-align: top;"><strong>Contenu</strong></td>
              <td style="padding: 8px 0; color: #0F172A;">${contribution.description.substring(0, 200)}${contribution.description.length > 200 ? '...' : ''}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748B;"><strong>Reçu le</strong></td>
              <td style="padding: 8px 0; color: #0F172A;">${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Bamako' })}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${dashboardUrl}"
              style="background: #059669; color: white; padding: 12px 24px; border-radius: 6px;
                     text-decoration: none; font-weight: bold; display: inline-block;">
              Voir dans le tableau de bord →
            </a>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #94A3B8; text-align: center;">
            IMPACT SAHEL — Lab'Citoyen · District de Bamako<br>
            Ce message est envoyé automatiquement, ne pas répondre.
          </p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: mailConfig.from,
        to: adminEmails.join(', '),
        subject: `[InnovSahel] ${typeLabel} — ${contribution.communeId}`,
        html,
      });
      this.logger.log(`Notification envoyée aux admins pour la contribution ${contribution.id}`);
    } catch (error) {
      // En cas d'échec d'email, on log mais on ne bloque pas la réponse au citoyen
      this.logger.error(`Échec d'envoi de notification email : ${error.message}`);
    }
  }

  /**
   * Email de bienvenue envoyé à un nouveau porteur (avec ses identifiants temporaires).
   */
  async sendPorteurWelcome(email: string, name: string, tempPassword: string): Promise<void> {
    if (!mailConfig.auth.user) return;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #062326; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #34D399; margin: 0;">Bienvenue sur InnovSahel !</h2>
        </div>
        <div style="background: #F8FAFC; padding: 24px; border-radius: 0 0 8px 8px;">
          <p>Bonjour <strong>${name}</strong>,</p>
          <p>Votre compte Porteur d'initiative a été créé sur la plateforme InnovSahel du Lab'Citoyen.</p>
          <div style="background: #ECFDF5; border: 1px solid #6EE7B7; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Vos identifiants de connexion :</strong></p>
            <p style="margin: 8px 0;">Email : <code>${email}</code></p>
            <p style="margin: 8px 0;">Mot de passe temporaire : <code>${tempPassword}</code></p>
          </div>
          <p>⚠️ <strong>Vous serez invité(e) à changer votre mot de passe à la première connexion.</strong></p>
          <p>Bonne aventure entrepreneuriale !</p>
          <p style="color: #064E3B;"><strong>L'équipe IMPACT SAHEL</strong></p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: mailConfig.from,
        to: email,
        subject: '[InnovSahel] Vos identifiants de connexion',
        html,
      });
    } catch (error) {
      this.logger.error(`Échec d'envoi de l'email de bienvenue à ${email} : ${error.message}`);
    }
  }
}
