import { expect, test } from '@playwright/test'

import { FakeBackend } from './support/fake-backend'

test('a patient goes from sign up to booked', async ({ page }) => {
  const backend = new FakeBackend()
  await backend.install(page)

  await test.step('signed-out visitors are sent to log in', async () => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login$/)
  })

  await test.step('sign up and land in a new chat', async () => {
    await page.getByRole('button', { name: 'Create an account' }).click()
    await page.getByLabel('Email').fill('patient@example.com')
    await page.getByLabel('Password').fill('correct-horse-9')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByRole('log', { name: 'Conversation' })).toContainText('I’m glad you reached out')
  })

  await test.step('talk to the AI until intake completes', async () => {
    const composer = page.getByRole('textbox', { name: 'Message' })
    for (const [index, text] of backend.patientLines.entries()) {
      await composer.fill(text)
      await page.getByRole('button', { name: 'Send message' }).click()
      if (index < backend.patientLines.length - 1) {
        await expect(page.getByRole('log', { name: 'Conversation' })).toContainText(backend.assistantLines[index])
        await expect(page.getByRole('progressbar', { name: 'Intake progress' })).toHaveAttribute(
          'aria-valuenow',
          String(backend.progressAfter(index)),
        )
      }
    }
    await expect(page).toHaveURL(new RegExp(`/dashboard/${backend.id}$`))
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('A doctor will review your transcript')
    await expect(page.getByRole('region', { name: 'Conversation' })).toContainText(backend.patientLines[0])
  })

  await test.step('the plan appears once the team marks it ready', async () => {
    backend.setStatus('plan_ready')
    await page.reload()
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('Your plan is ready for your review')
    await expect(page.getByTitle('Plan PDF preview')).toBeVisible()
    await expect(page.getByRole('link', { name: /download your plan/i })).toBeVisible()
  })

  await test.step('commenting sends the plan back for review', async () => {
    await page.getByLabel('Your comments on the plan').fill('Please add a second hotel option.')
    await page.getByRole('button', { name: 'Send comments' }).click()
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('Your comments are being reviewed')
    await expect(page.getByRole('list', { name: 'Previous comments' })).toContainText('Please add a second hotel option.')
    await expect(page.getByLabel('Your comments on the plan')).toHaveCount(0)
    await expect(page.getByRole('button', { name: 'Approve plan' })).toHaveCount(0)
  })

  await test.step('approving moves the case to payment', async () => {
    backend.setStatus('plan_ready')
    await page.reload()
    await page.getByRole('button', { name: 'Approve plan' }).click()
    await page.getByRole('button', { name: 'Confirm approval' }).click()
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('You approved your plan')
    await expect(page.getByRole('button', { name: 'Pay $150.00' })).toBeVisible()
  })

  await test.step('paying sends the patient to Stripe and back', async () => {
    await page.getByRole('button', { name: 'Pay $150.00' }).click()
    await expect(page).toHaveURL(/\/mock-stripe$/)
    await expect(page.getByRole('heading', { name: 'Stripe Checkout' })).toBeVisible()
    await page.goto(`/dashboard/${backend.id}?paid=1`)
    await expect(page.getByText('We are confirming your payment')).toBeVisible()
    await expect(page.getByRole('button', { name: /^Pay/ })).toHaveCount(0)
  })

  await test.step('the webhook moves the case to reservations without a reload', async () => {
    backend.setStatus('reservations')
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('Reservations are being made', { timeout: 30_000 })
  })

  await test.step('the team marks it booked', async () => {
    backend.setStatus('booked')
    await page.reload()
    await expect(page.getByRole('region', { name: 'Case status' })).toContainText('We have emailed you everything')
  })
})
