import { HandlebarsAdapter } from '@nest-modules/mailer';

export = {
  transport:
    process.env.MAIL_TRANSPORT ?? 'smtp://admin123:admin456@localhost:2500',
  defaults: {
    from: process.env.MAIL_FROM ?? 'admin@test.example.com',
  },
  template: {
    dir: './templates/email',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
