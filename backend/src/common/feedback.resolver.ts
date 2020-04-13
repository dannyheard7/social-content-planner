import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SendFeebackInput } from './SendFeebackInput';


@Resolver()
export class FeedbackResolver {
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) { }

    @Mutation(of => Boolean)
    async sendFeedback(
        @Args({
            name: 'feedback',
            type: () => SendFeebackInput,
        })
        feedback: SendFeebackInput,
        @Args({
            name: 'email',
            type: () => String,
            nullable: true
        })
        email?: string,
    ): Promise<boolean> {
        let submitter = email || "anonymous";

        try {
            await this
                .mailerService
                .sendMail({
                    to: 'danny.heard@elevait.co.uk',
                    from: this.configService.get<string>('EMAIL_SENDER'),
                    subject: 'Feedback',
                    text: `Feedback was sent by ${submitter}, Message: ${feedback.message}`,
                    html: `<p>Feedback was sent by ${submitter}<p> <br /> <p>Message: ${feedback.message}<p>`,
                })
            return true
        } catch (e) {
            console.error(e.message);
            return false;
        }
    }
}
