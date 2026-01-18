import { NextRequest, NextResponse } from 'next/server'
import { getAdminByEmail, createPasswordResetToken } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await getAdminByEmail(email)

    if (!user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        message: 'If an account exists with this email, you will receive a password reset link.',
      })
    }

    const resetToken = await createPasswordResetToken(user.id)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Failed to create reset token' },
        { status: 500 }
      )
    }

    // In production, send email with reset link
    // For now, log the token (in production use a service like SendGrid)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`
    console.log('Password reset link:', resetLink)

    return NextResponse.json({
      message: 'If an account exists with this email, you will receive a password reset link.',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
