-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_method TEXT DEFAULT 'email' CHECK (two_factor_method IN ('email', 'authenticator')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC+5',
  currency TEXT DEFAULT 'PKR',
  show_phone BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT false,
  profile_visibility BOOLEAN DEFAULT true,
  private_mode BOOLEAN DEFAULT false,
  email_ad_approved BOOLEAN DEFAULT true,
  email_ad_rejected BOOLEAN DEFAULT true,
  email_payment_verified BOOLEAN DEFAULT true,
  in_app_notifications BOOLEAN DEFAULT true,
  sound_notifications BOOLEAN DEFAULT false,
  default_category TEXT DEFAULT 'all',
  default_city TEXT DEFAULT 'all',
  auto_renew_ads BOOLEAN DEFAULT false,
  featured_ad_preference BOOLEAN DEFAULT false,
  theme_color TEXT DEFAULT 'indigo',
  compact_mode BOOLEAN DEFAULT false,
  card_list_view BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own settings
CREATE POLICY "Users can view own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Service role can do everything
CREATE POLICY "Service role full access"
  ON public.user_settings
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.user_settings TO authenticated;
GRANT ALL ON public.user_settings TO service_role;
