/**
 * Export Report API Route
 * Generates PDF reports using Puppeteer
 */

import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const partnerId = searchParams.get('partnerId');
  
  try {
    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2, // Higher quality
    });

    // Build the print report URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${process.env.PORT || 3000}`;
    const printUrl = partnerId 
      ? `${baseUrl}/print-report?partnerId=${partnerId}`
      : `${baseUrl}/print-report`;

    // Navigate to print report page
    await page.goto(printUrl, {
      waitUntil: 'networkidle0', // Wait for all network requests to finish
      timeout: 60000, // 60 second timeout
    });

    // Wait for charts to render (Recharts needs extra time)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Additional wait for any lazy-loaded content
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (document.readyState === 'complete') {
          resolve(true);
        } else {
          window.addEventListener('load', () => resolve(true));
        }
      });
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; font-size: 9px; padding: 5px; text-align: center; color: #666;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          <span style="margin-left: 20px;">Generated: ${new Date().toLocaleDateString()}</span>
        </div>
      `,
    });

    await browser.close();

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = partnerId 
      ? `partner-report-${partnerId}-${date}.pdf`
      : `partner-report-all-${date}.pdf`;

    // Return PDF
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


