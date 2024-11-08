import { View } from '@/components/canvas/View'
import { Common } from '@/components/canvas/View'

export default function GameCanvas() {
  return (
    <div className="flex justify-center items-center w-full h-full p-8">
      <div 
        className="relative w-[1280px] h-[720px] bg-white/10 rounded-2xl shadow-lg backdrop-blur-sm border-4 border-transparent animate-border bg-gradient p-[1px]"
        style={{
          maxWidth: '100%',
          aspectRatio: '16/9',
        }}
      >
        <div className="absolute inset-0 rounded-2xl bg-black/20 backdrop-blur-sm" />
        <View className="relative w-full h-full rounded-2xl overflow-hidden">
          <Common color="transparent" />
          {/* Your game components will go here */}
        </View>
      </div>
    </div>
  )
}
