import dayjs from 'dayjs';

import {createRequire} from 'module';
import Subscription from '../models/subscription.model.js';
const require = createRequire(import.meta.url);

const {serve} = require('@upstash/workflow/express');


const REMINDER = [7, 5, 2, 1]

export const sendRemainder = serve(async (context) => {
    const subscriptionId = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== active) return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renewal day has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    for(const daysBefore of REMINDER) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntillReminder(context, `Reminder ${daysBefore} says before`, reminderDate);
        }

        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
    
});


const fetchSubscription = async (context, subscriptionId) => {
    return context.run('get subscription', () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    });
}

const sleepUntillReminder = async (context, label, date) => {
    console.log(`Sleeping untill ${label} reminder at ${date}`);
    await context.sleepUntill(label, date.toDate());
}

const triggerReminder  = async (context, label) => {
    return context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
    });
}