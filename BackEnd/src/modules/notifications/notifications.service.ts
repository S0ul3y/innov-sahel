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
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}`;

    // Toujours logger les identifiants générés pour la traçabilité / développement
    this.logger.log(
      `📧 [PORTEUR IDENTIFIANTS] Compte créé pour « ${name} » (${email}) | Mot de passe : ${tempPassword} | URL : ${loginUrl}`
    );

    const isDummySmtp =
      !mailConfig.auth.user ||
      mailConfig.auth.user === 'votre.email@gmail.com' ||
      !mailConfig.auth.pass ||
      mailConfig.auth.pass === 'VotreMotDePasseApp';

    if (isDummySmtp) {
      this.logger.log(
        `ℹ️ Configuration SMTP locale (fictive). L'email aux porteurs est simulé. Pour activer l'envoi réel, configurez MAIL_USER et MAIL_PASSWORD dans BackEnd/.env.`
      );
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B;">
        <div style="background: #062326; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #34D399; margin: 0; font-size: 22px;">🌱 Bienvenue sur InnovSahel !</h2>
          <p style="color: #94A3B8; margin: 6px 0 0; font-size: 13px;">Plateforme citoyenne & incubateur du District de Bamako</p>
        </div>
        <div style="background: #F8FAFC; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0;">
          <p style="font-size: 15px;">Bonjour <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Votre compte <strong>Porteur d'initiative</strong> a été créé et enregistré avec succès sur la plateforme <strong>InnovSahel</strong> (Lab'Citoyen).
          </p>
          <div style="background: #ECFDF5; border: 1px solid #6EE7B7; border-radius: 10px; padding: 18px; margin: 24px 0;">
            <p style="margin: 0 0 12px; font-weight: bold; color: #065F46; font-size: 14px;">🔑 Vos identifiants de connexion :</p>
            <p style="margin: 6px 0; font-size: 13px;">
              <strong>Email :</strong> <code style="background:#FFFFFF; padding:4px 8px; border-radius:6px; border:1px solid #CBD5E1; font-family: monospace;">${email}</code>
            </p>
            <p style="margin: 6px 0; font-size: 13px;">
              <strong>Mot de passe temporaire :</strong> <code style="background:#FFFFFF; padding:4px 8px; border-radius:6px; border:1px solid #CBD5E1; font-family: monospace; font-size: 14px; color: #059669; font-weight: bold;">${tempPassword}</code>
            </p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${loginUrl}" style="background: #059669; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              Accéder à mon espace porteur →
            </a>
          </div>
          <p style="color: #DC2626; font-size: 12px; background: #FEF2F2; border: 1px solid #FECACA; padding: 10px 14px; border-radius: 8px;">
            ⚠️ <strong>Mot de passe temporaire :</strong> Ce mot de passe composé de caractères spéciaux, lettres et chiffres vous permettra de vous connecter. Vous serez invité(e) à le modifier lors de votre première session.
          </p>
          <p style="font-size: 13px; color: #475569; margin-top: 20px;">Excellente réussite dans votre initiative citoyenne !</p>
          <p style="color: #064E3B; font-weight: bold; font-size: 14px;">L'équipe IMPACT SAHEL</p>
          <p style="font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 14px; margin-top: 20px; text-align: center;">
            IMPACT SAHEL — Lab'Citoyen · District de Bamako<br>Ce message est généré automatiquement par la plateforme InnovSahel.
          </p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: mailConfig.from,
        to: email,
        subject: '[InnovSahel] 🔑 Vos identifiants de connexion — Porteur d\'initiative',
        html,
      });
      this.logger.log(`Email de bienvenue porteur envoyé avec succès à ${email}`);
    } catch (error) {
      this.logger.error(`Échec d'envoi de l'email de bienvenue à ${email} : ${error.message}`);
    }
  }

  /**
   * Email de bienvenue envoyé à un nouvel Admin Platform (avec ses identifiants temporaires).
   */
  async sendAdminWelcome(email: string, name: string, tempPassword: string): Promise<void> {
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}`;

    // Toujours logger les identifiants générés pour la traçabilité / développement
    this.logger.log(
      `📧 [ADMIN IDENTIFIANTS] Compte créé pour « ${name} » (${email}) | Mot de passe : ${tempPassword} | URL : ${loginUrl}`
    );

    const isDummySmtp =
      !mailConfig.auth.user ||
      mailConfig.auth.user === 'votre.email@gmail.com' ||
      !mailConfig.auth.pass ||
      mailConfig.auth.pass === 'VotreMotDePasseApp';

    if (isDummySmtp) {
      this.logger.log(
        `ℹ️ Configuration SMTP locale (fictive). L'email administrateur est simulé. Pour activer l'envoi réel, configurez MAIL_USER et MAIL_PASSWORD dans BackEnd/.env.`
      );
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1E293B;">
        <div style="background: #062326; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h2 style="color: #FBBF24; margin: 0; font-size: 22px;">🛡️ Accès Administrateur — InnovSahel</h2>
          <p style="color: #94A3B8; margin: 6px 0 0; font-size: 13px;">Plateforme citoyenne & administration du District de Bamako</p>
        </div>
        <div style="background: #F8FAFC; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #E2E8F0;">
          <p style="font-size: 15px;">Bonjour <strong>${name}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.5; color: #475569;">
            Un compte <strong>Administrateur Platform</strong> vous a été attribué et enregistré dans la base de données de la plateforme <strong>InnovSahel</strong>.
          </p>
          <div style="background: #FFFBEB; border: 1px solid #FCD34D; border-radius: 10px; padding: 18px; margin: 24px 0;">
            <p style="margin: 0 0 12px; font-weight: bold; color: #92400E; font-size: 14px;">🔑 Vos identifiants administrateur :</p>
            <p style="margin: 6px 0; font-size: 13px;">
              <strong>Email :</strong> <code style="background:#FFFFFF; padding:4px 8px; border-radius:6px; border:1px solid #CBD5E1; font-family: monospace;">${email}</code>
            </p>
            <p style="margin: 6px 0; font-size: 13px;">
              <strong>Mot de passe temporaire :</strong> <code style="background:#FFFFFF; padding:4px 8px; border-radius:6px; border:1px solid #CBD5E1; font-family: monospace; font-size: 14px; color: #D97706; font-weight: bold;">${tempPassword}</code>
            </p>
          </div>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${loginUrl}" style="background: #D97706; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
              Accéder à l'espace Admin →
            </a>
          </div>
          <p style="color: #DC2626; font-size: 12px; background: #FEF2F2; border: 1px solid #FECACA; padding: 10px 14px; border-radius: 8px;">
            ⚠️ <strong>Sécurité :</strong> Ce mot de passe a été généré avec des caractères spéciaux, chiffres et lettres. Veuillez le renouveler lors de votre première connexion dans les paramètres.
          </p>
          <p style="font-size: 13px; color: #64748B; margin-top: 20px;">Ne communiquez jamais vos identifiants. Pour toute question, contactez le Super Administrateur.</p>
          <p style="color: #064E3B; font-weight: bold; font-size: 14px;">L'équipe IMPACT SAHEL</p>
          <p style="font-size: 11px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 14px; margin-top: 20px; text-align: center;">
            IMPACT SAHEL — Lab'Citoyen · District de Bamako<br>Ce message est généré automatiquement par la plateforme InnovSahel.
          </p>
        </div>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: mailConfig.from,
        to: email,
        subject: '[InnovSahel] 🛡️ Vos accès Administrateur Platform',
        html,
      });
      this.logger.log(`Email de bienvenue admin envoyé avec succès à ${email}`);
    } catch (error) {
      this.logger.error(`Échec d'envoi de l'email admin à ${email} : ${error.message}`);
    }
  }
}
