# ChatGPT API Integration Setup Instructions

## ⚠️ SECURITY BEST PRACTICES

Always use environment variables for API keys:
1. Never commit API keys to Git
2. Use `.env` files for local development
3. Use platform environment variables for production

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Add Your New API Key
Edit the `.env` file and add your new API key:
```
OPENAI_API_KEY=your_new_api_key_here
```

### 4. Start the App
```bash
npm start
```

## 🔧 Features Implemented

### ✅ Core Functionality
- **AI Topic Generation**: Dynamic topics based on selected field and role
- **Smart Caching**: 24-hour cache to reduce API costs
- **Rate Limiting**: 1-second minimum between requests
- **Error Handling**: Graceful fallback to default topics
- **Loading States**: Visual feedback during API calls

### ✅ Security Features
- **Secure API Key Storage**: Using Expo Constants ( environment variables
- **Git Protection**: `.env` files excluded from version control
- **Input Validation**: Proper error messages for missing keys

### ✅ User Experience
- **Refresh Button**: Regenerate topics on demand
- **Connection Logging**: Debug logs stored locally
- **Loading Indicators**: "AI가 주제를 생성중입니다..." message
- **Error Recovery**: Retry button for failed requests

## 📱 How It Works

1. **Field Selection**: User selects UX/UI, Graphic, Branding, etc.
2. **Role Selection**: User selects their designer role
3. **AI Topics**: App calls ChatGPT API with context-aware prompts
4. **Topic Display**: 5-7 relevant, actionable work topics shown
5. **Caching**: Results cached for 24 hours per field/role combo

## 🔍 Testing

### Test API Connection
1. Select any field ( "UX/UI"
2. Select any role ( "UX/UI Designer"
3. Navigate to topic step
4. Check console logs for connection status

### Test Error Handling
1. Temporarily remove API key from `.env`
2. Try generating topics
3. Should see fallback topics and error message

## 📊 Monitoring

### View Connection Logs
```javascript
// In your app, you can access logs:
import openaiService from '@/services/openai';
const logs = await openaiService.getLogs();
console.log('API Logs:', logs);
```

### Clear Cache
```javascript
// Clear all cached topics and logs
await openaiService.clearCache();
```

## 🛠️ Technical Details

### Model Used
- **gpt-4o-mini** ( corrected from invalid `gpt-5-mini-2025-08-07`
- Max tokens: 300 per request
- Temperature: 0.7 for balanced creativity

### Prompt Engineering
System generates field-specific prompts like:
```
Generate 5-7 relevant work topics for a UX/UI Designer working in UX/UI.
Topics should be specific, actionable, and concise (max 60 characters).
```

### Cache Strategy
- **Key**: `ai_topics_${field}_${role}`
- **Duration**: 24 hours
- **Storage**: AsyncStorage
- **Fallback**: Default topics if API fails

## 🚨 Important Notes

1. **Never commit `.env` files** to version control
2. **Monitor API usage** in OpenAI dashboard
3. **Rate limiting** prevents accidental cost spikes
4. **Model correction**: Using `gpt-4o-mini` instead of non-existent `gpt-5-mini`
5. **Token limits**: Set to 300 to control costs

## 🎯 Next Steps

1. ✅ Revoke exposed API key
2. ✅ Generate new API key  
3. ✅ Complete setup steps above
4. ✅ Test with new API key
5. 🔄 Monitor usage and costs
6. 🔄 Adjust prompts based on topic quality

## 📞 Support

If you encounter issues:
1. Check console logs for connection status
2. Verify API key in `.env` file
3. Ensure internet connectivity
4. Check OpenAI API status and usage limits
