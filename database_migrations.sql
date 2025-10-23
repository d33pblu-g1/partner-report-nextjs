-- ============================================================================
-- Partner Rankings and Insights - Database Migration
-- ============================================================================

-- 1. Add global_rank column to partners table
ALTER TABLE partners ADD COLUMN global_rank INT DEFAULT NULL;

-- 2. Populate global_rank with random values between 100 and 200
UPDATE partners SET global_rank = FLOOR(100 + RAND() * 101);

-- 3. Create partner_insights table
CREATE TABLE IF NOT EXISTS partner_insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id VARCHAR(50) NOT NULL,
  insight_text TEXT NOT NULL,
  category VARCHAR(50),
  priority INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_partner (partner_id),
  INDEX idx_active (is_active),
  INDEX idx_priority (priority)
);

-- 4. Create partner_recommendations table
CREATE TABLE IF NOT EXISTS partner_recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id VARCHAR(50) NOT NULL,
  recommendation_text TEXT NOT NULL,
  category VARCHAR(50),
  priority INT DEFAULT 1,
  action_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_partner (partner_id),
  INDEX idx_active (is_active),
  INDEX idx_priority (priority)
);

-- 5. Sample Insights Data
-- Note: Replace 'PARTNER_ID_1', 'PARTNER_ID_2' etc with actual partner IDs from your database

INSERT INTO partner_insights (partner_id, insight_text, category, priority) VALUES
-- Trading behavior insights
('PARTNER_ID_1', 'Your customers trading trends have been shifting from synthetics to crypto over the past 3 months', 'trading_behavior', 1),
('PARTNER_ID_1', 'Trading volume on MT5 has increased by 45% compared to last month', 'platform_usage', 2),
('PARTNER_ID_1', 'Your Spanish-speaking customers prefer forex trading over other instruments', 'demographics', 3),

-- Device usage insights
('PARTNER_ID_2', 'Most of your customers this month have traded on their mobile phone as opposed to last month which was web-dominated', 'device_usage', 1),
('PARTNER_ID_2', 'Mobile app engagement has increased by 60% in the last 30 days', 'device_usage', 2),
('PARTNER_ID_2', 'Desktop users tend to have 2x higher trading volumes than mobile users', 'behavior', 3),

-- Link performance insights
('PARTNER_ID_3', 'Your most profitable link was the Instagram campaign posted on March 15th', 'link_performance', 1),
('PARTNER_ID_3', 'Facebook referrals have the highest conversion rate at 23%', 'link_performance', 2),
('PARTNER_ID_3', 'YouTube traffic shows strong engagement but lower conversion rates', 'link_performance', 3),

-- Platform preferences
('PARTNER_ID_4', 'Your customers are increasingly choosing cTrader over MT5, up 35% this quarter', 'platform_usage', 1),
('PARTNER_ID_4', '70% of new clients start with demo accounts before going live', 'behavior', 2),
('PARTNER_ID_4', 'Weekend trading activity has grown by 28% compared to last quarter', 'timing', 3);

-- 6. Sample Recommendations Data
INSERT INTO partner_recommendations (partner_id, recommendation_text, category, priority, action_url) VALUES
-- Acquisition and activation
('PARTNER_ID_1', 'You have a healthy acquisition channel; you should concentrate more on activation and reactivation campaigns', 'strategy', 1, '/clients'),
('PARTNER_ID_1', 'Consider creating targeted content for crypto traders to capitalize on the trend shift', 'content', 2, '/partner-links'),
('PARTNER_ID_1', 'Schedule webinars for Spanish-speaking clients to boost engagement', 'engagement', 3, '/events'),

-- KYC and onboarding
('PARTNER_ID_2', 'Most of your customers are stuck on KYC verification. Consider creating a step-by-step guide or video tutorial', 'onboarding', 1, '/clients'),
('PARTNER_ID_2', 'Implement push notifications for mobile users to increase trading frequency', 'engagement', 2, NULL),
('PARTNER_ID_2', 'Your demo-to-live conversion rate is below average. Focus on demo account education', 'conversion', 3, '/client-lifecycle'),

-- Campaign optimization
('PARTNER_ID_3', 'Customers from your Facebook campaign show 40% higher retention. Increase budget allocation there', 'marketing', 1, '/partner-links'),
('PARTNER_ID_3', 'YouTube viewers need more educational content before conversion. Create platform tutorials', 'content', 2, '/partner-links'),
('PARTNER_ID_3', 'A/B test different call-to-action messages on your Instagram posts', 'optimization', 3, NULL),

-- Retention and reactivation
('PARTNER_ID_4', 'You have 45 dormant clients who were active 30-60 days ago. Launch a reactivation email campaign', 'retention', 1, '/clients'),
('PARTNER_ID_4', 'Promote cTrader features more prominently as it shows higher customer satisfaction', 'platform', 2, '/partner-links'),
('PARTNER_ID_4', 'Weekend traders are underserved. Consider weekend-specific promotions or support', 'timing', 3, NULL);

-- ============================================================================
-- API Query Examples
-- ============================================================================

-- Get top 3 insights for a partner
-- SELECT * FROM partner_insights 
-- WHERE partner_id = ? AND is_active = TRUE 
-- ORDER BY priority ASC 
-- LIMIT 3;

-- Get top 3 recommendations for a partner
-- SELECT * FROM partner_recommendations 
-- WHERE partner_id = ? AND is_active = TRUE 
-- ORDER BY priority ASC 
-- LIMIT 3;

-- Get partner with ranks
-- SELECT partner_id, name, tier, Country_Rank, global_rank 
-- FROM partners 
-- WHERE partner_id = ?;

-- ============================================================================
-- Affiliate Tips Feature - Database Migration
-- ============================================================================

-- 7. Create affiliate_tips table
CREATE TABLE IF NOT EXISTS affiliate_tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tip_text TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_active (is_active),
  INDEX idx_category (category)
);

-- 8. Populate with 100 forex affiliate/IB tips
INSERT INTO affiliate_tips (tip_text, category) VALUES
-- Marketing Strategy Tips
('Focus on building trust before selling. Share educational content about forex trading to establish yourself as an authority in the space.', 'marketing'),
('Leverage video content on YouTube and TikTok. Visual demonstrations of trading strategies get 3x more engagement than text posts.', 'marketing'),
('Create a content calendar and post consistently. Affiliates who post daily see 5x more conversions than those who post sporadically.', 'marketing'),
('Use storytelling in your marketing. Share your own trading journey, wins, and lessons learned to create emotional connections.', 'marketing'),
('Partner with micro-influencers in the finance niche. They often have higher engagement rates than macro-influencers.', 'marketing'),
('Run webinars on forex trading basics. Live sessions create urgency and allow real-time interaction with potential clients.', 'marketing'),
('Create comparison guides between different brokers and platforms. Transparency builds trust and positions you as unbiased.', 'marketing'),
('Optimize your content for voice search. More traders are asking Alexa and Google Assistant about forex brokers.', 'marketing'),
('Build an email sequence for new subscribers. A 7-day educational series converts better than single promotional emails.', 'marketing'),
('Use retargeting ads for website visitors who didn''t convert. They''re 70% more likely to sign up with a gentle reminder.', 'marketing'),

-- Client Acquisition Tips
('Offer a comprehensive beginner''s guide as a lead magnet. Collect emails first, then nurture leads toward sign-up.', 'acquisition'),
('Host free trading competitions with small prizes. Gamification attracts new traders and keeps them engaged.', 'acquisition'),
('Create platform-specific tutorials. Help clients understand MT4, MT5, and cTrader to reduce onboarding friction.', 'acquisition'),
('Leverage social proof by showcasing testimonials from successful traders you''ve referred.', 'acquisition'),
('Target specific geographic markets. Tailor your messaging to local trading preferences and regulations.', 'acquisition'),
('Develop a referral program for your existing clients. Word-of-mouth remains the highest-converting channel.', 'acquisition'),
('Create a free demo account guide. Show beginners how to practice risk-free before committing real funds.', 'acquisition'),
('Build landing pages for specific traffic sources. Customize messaging for YouTube, Facebook, and Google traffic.', 'acquisition'),
('Offer one-on-one onboarding calls for high-value leads. Personal attention significantly increases conversion rates.', 'acquisition'),
('Use exit-intent popups with exclusive bonuses. Capture leaving visitors with a compelling last-minute offer.', 'acquisition'),

-- Retention Strategies
('Send personalized birthday and milestone messages to your clients. Small gestures build long-term loyalty.', 'retention'),
('Create a private community for your traders. Facebook Groups or Discord servers foster belonging and reduce churn.', 'retention'),
('Share weekly market analysis and trading ideas. Keep clients engaged even when they''re not actively trading.', 'retention'),
('Implement a tiered rewards program. Recognize and reward active traders with exclusive perks and bonuses.', 'retention'),
('Monitor client activity and reach out to dormant traders. A simple check-in message can reactivate 20-30% of inactive accounts.', 'retention'),
('Provide ongoing education through monthly masterclasses. Continuous learning keeps clients engaged and trading.', 'retention'),
('Celebrate client wins publicly (with permission). Recognition motivates continued activity and attracts new clients.', 'retention'),
('Send market alerts during high-volatility events. Timely information demonstrates value beyond just the referral.', 'retention'),
('Create seasonal campaigns around major trading events like NFP or Fed announcements.', 'retention'),
('Survey your clients regularly to understand their needs and pain points. Act on feedback to improve retention.', 'retention'),

-- Platform Optimization
('Master the platforms you promote. Be able to answer technical questions about MT4, MT5, and cTrader confidently.', 'platforms'),
('Create video walkthroughs of key platform features. Visual guides reduce support requests and improve user experience.', 'platforms'),
('Highlight mobile trading capabilities. Over 60% of new traders prefer mobile-first solutions.', 'platforms'),
('Explain the differences between platform types. Help clients choose between MT4, MT5, and proprietary platforms.', 'platforms'),
('Showcase advanced features like algorithmic trading and copy trading. These attract experienced traders.', 'platforms'),
('Provide indicator and EA installation guides. Technical traders value this hands-on support.', 'platforms'),
('Compare platform execution speeds and features. Data-driven comparisons help traders make informed decisions.', 'platforms'),
('Create platform-specific trading strategy guides. Show how to implement strategies on each platform.', 'platforms'),
('Highlight platform security features. Address concerns about fund safety and data protection.', 'platforms'),
('Stay updated on platform updates and new features. Share news to position yourself as knowledgeable.', 'platforms'),

-- Social Media Best Practices
('Post during peak trading hours (London and New York sessions). Your audience is most active when markets are moving.', 'social_media'),
('Use hashtags strategically. Research trending forex hashtags but don''t overuse them—5-10 per post is optimal.', 'social_media'),
('Share real-time trade ideas during market hours. Live content creates urgency and engagement.', 'social_media'),
('Create Instagram Reels and TikToks under 30 seconds. Short-form video content dominates social algorithms.', 'social_media'),
('Engage with comments within the first hour. Early engagement boosts your post''s visibility in feeds.', 'social_media'),
('Share behind-the-scenes content. Show your workspace, daily routine, and analysis process to build authenticity.', 'social_media'),
('Use polls and questions in Instagram Stories. Interactive content increases engagement and provides market insights.', 'social_media'),
('Cross-post content strategically. Adapt your message for each platform rather than duplicating exactly.', 'social_media'),
('Collaborate with other forex affiliates. Cross-promotion exposes you to new audiences in your niche.', 'social_media'),
('Respond to DMs promptly. Direct messages are high-intent leads that deserve immediate attention.', 'social_media'),

-- Content Creation Tips
('Write detailed broker reviews with pros and cons. Balanced reviews rank better in Google and build trust.', 'content'),
('Create "vs" comparison articles (e.g., "MT4 vs MT5"). These target high-intent search queries.', 'content'),
('Develop a glossary of forex terms. Educational resources attract organic traffic and establish authority.', 'content'),
('Record podcast episodes interviewing successful traders. Audio content reaches audiences during commutes.', 'content'),
('Write case studies of successful trading strategies. Story-based content is more memorable than theoretical advice.', 'content'),
('Create downloadable resources like cheat sheets and checklists. Gated content builds your email list.', 'content'),
('Optimize all content for SEO. Research keywords like "best forex broker for beginners" to rank in search.', 'content'),
('Update old content regularly. Fresh content ranks better and provides value to returning visitors.', 'content'),
('Repurpose content across formats. Turn a blog post into a video, infographic, and social media carousel.', 'content'),
('Include clear calls-to-action in every piece of content. Make the next step obvious for interested readers.', 'content'),

-- Conversion Optimization
('A/B test your landing pages continuously. Small changes to headlines or CTAs can increase conversions by 20-50%.', 'conversion'),
('Reduce form fields on sign-up pages. Each additional field decreases conversion rates by 5-10%.', 'conversion'),
('Add trust badges and security certifications. Visual trust signals reduce anxiety and increase sign-ups.', 'conversion'),
('Use countdown timers for limited-time offers. Scarcity drives action, but use it authentically.', 'conversion'),
('Implement live chat on high-traffic pages. Real-time support can increase conversions by 15-30%.', 'conversion'),
('Create urgency with "limited spots" messaging. Exclusivity makes offers more attractive.', 'conversion'),
('Show real-time sign-up notifications. Social proof widgets demonstrate that others are taking action.', 'conversion'),
('Optimize page load speed. Every second of delay costs you 7% in conversions.', 'conversion'),
('Make your CTA buttons stand out. Use contrasting colors and action-oriented text like "Start Trading Now".', 'conversion'),
('Offer multiple sign-up options. Email, Google, and social logins reduce friction for different users.', 'conversion'),

-- Compliance & Ethics
('Always disclose your affiliate relationship. Transparency is required by law and builds trust with your audience.', 'compliance'),
('Never guarantee returns or profits. Making financial promises violates regulations in most jurisdictions.', 'compliance'),
('Include risk warnings in all promotional material. Forex trading involves significant risk of loss.', 'compliance'),
('Stay informed about advertising regulations in your target markets. Rules vary significantly by country.', 'compliance'),
('Don''t use fake scarcity or false claims. Ethical marketing builds sustainable, long-term businesses.', 'compliance'),
('Verify that your broker is properly regulated. Promoting unregulated brokers can expose you to legal risks.', 'compliance'),
('Keep records of all promotional materials. Documentation protects you if regulatory questions arise.', 'compliance'),
('Respect data privacy laws like GDPR. Obtain proper consent before collecting and using personal information.', 'compliance'),
('Avoid aggressive sales tactics. Pressure selling harms your reputation and may violate regulations.', 'compliance'),
('Educate clients about risks before promoting high leverage. Responsible marketing protects both you and your clients.', 'compliance'),

-- Analytics & Tracking
('Use UTM parameters on all links. Track which content and channels drive the most valuable clients.', 'analytics'),
('Monitor conversion rates by traffic source. Double down on channels that convert best.', 'analytics'),
('Track client lifetime value, not just sign-ups. Focus on quality over quantity of referrals.', 'analytics'),
('Set up Google Analytics goals for key actions. Measure the full funnel, not just final conversions.', 'analytics'),
('Analyze which content topics drive the most engagement. Create more of what resonates with your audience.', 'analytics'),
('Monitor your most profitable referral times. Identify patterns in when clients are most likely to convert.', 'analytics'),
('Track email open rates and click-through rates. Optimize subject lines and content based on data.', 'analytics'),
('Use heatmaps to understand how visitors interact with your site. Optimize layout based on behavior.', 'analytics'),
('Set up conversion tracking in your ad platforms. Measure ROAS to optimize advertising spend.', 'analytics'),
('Review your analytics weekly. Regular analysis helps you spot trends and opportunities quickly.', 'analytics'),

-- Relationship Building
('Network with other affiliates in non-competing niches. Share strategies and learn from each other.', 'relationships'),
('Build a relationship with your affiliate manager. They can provide insider tips and better commission deals.', 'relationships'),
('Attend forex and affiliate marketing conferences. In-person connections often lead to the best partnerships.', 'relationships'),
('Collaborate on content with complementary businesses. Co-created content expands your reach.', 'relationships'),
('Join forex affiliate forums and communities. Stay connected with industry trends and best practices.', 'relationships'),
('Maintain open communication with your clients. Be accessible and responsive to questions and concerns.', 'relationships'),
('Create win-win partnerships with brokers. Negotiate terms that benefit both you and your clients.', 'relationships'),
('Support your clients'' success beyond just the referral. Ongoing value creates loyalty and referrals.', 'relationships'),
('Build relationships with trading educators. Cross-promotions with educators reach highly qualified leads.', 'relationships'),
('Stay in touch with past clients. Regular check-ins can reactivate dormant accounts and generate referrals.', 'relationships');

-- ============================================================================
-- API Query Example for Affiliate Tips
-- ============================================================================

-- Get a random active tip
-- SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY RAND() LIMIT 1;

-- Get tips by category
-- SELECT * FROM affiliate_tips WHERE category = ? AND is_active = TRUE;

-- Get all active tips
-- SELECT * FROM affiliate_tips WHERE is_active = TRUE ORDER BY created_at DESC;

