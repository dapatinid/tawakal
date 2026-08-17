<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
    
    <!-- FORM INFO PELANGGAN -->
    <main class="p-6 flex-grow space-y-6 max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Questioner Pelanggan</h1>

      <div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow space-y-4">
        <div>
          <label class="block font-semibold mb-1">Nama:</label>
          <input v-model="customer.name" type="text" class="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"/>
        </div>

        <div>
          <label class="block font-semibold mb-1">Kontak:</label>
          <input v-model="customer.contact" type="number" class="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"/>
        </div>

        <div>
          <label class="block font-semibold mb-1">Nama Usaha:</label>
          <input v-model="customer.businessName" type="text" class="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"/>
        </div>

        <div>
          <label class="block font-semibold mb-1">Jenis Usaha:</label>
          <input v-model="customer.businessType" type="text" class="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"/>
        </div>

        <div>
          <label class="block font-semibold mb-1">Alamat Usaha:</label>
          <input v-model="customer.businessAddress" type="text" class="w-full px-3 py-2 rounded border dark:border-gray-700 bg-gray-50 dark:bg-gray-900"/>
        </div>
      </div>

      <!-- QUESTIONER -->
      <div v-for="(q, index) in questions" :key="index" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <p class="font-semibold mb-2">{{ q.question }}</p>

        <div class="flex gap-4">
          <label
            v-for="(answer, i) in q.answers"
            :key="i"
            class="flex flex-col items-center cursor-pointer"
          >
            <component
              :is="getIconComponent(q.icon)"
              :class="[
                'w-6 h-6 transition-colors',
                answers[index] === answer ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'
              ]"
            />
            <input type="radio" :name="'q' + index" :value="answer" v-model="answers[index]" class="hidden"/>
            <span v-if="answers[index] === answer" class="mt-1 text-sm text-center">
              {{ answer }}
            </span>
          </label>
        </div>
      </div>

      <button
        @click="sendAnswers"
        class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Kirim ke WhatsApp
      </button>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  Star,
  Heart,
  Zap,
  FileText,
  Smile,
  PlusSquare,
  Archive,
  Bell,
  Tag,
  BarChart2,
  RotateCcw,
  MapPin,
  Gift,
  CreditCard,
  ShoppingCart,
  Eye,
  Clock,
  Activity,
  Grid,
  DollarSign,
  BellRing,
  Percent,
  AlertCircle,
  Image,
  BellOff,
  Headphones,
  Calendar,
  CornerUpLeft,
  ShoppingBag,
  Layers,
  Truck,
  RefreshCcw,
  Barcode,
  DivideSquare,
  Edit2,
  TrendingUp,
  CircleDollarSign,
} from 'lucide-vue-next';


const props = defineProps<{ questions: any[] }>();
const answers = ref(Array(props.questions.length).fill(''));

// Data pelanggan
const customer = ref({
  name: '',
  contact: '',
  businessName: '',
  businessType: '',
  businessAddress: '',
});

// Icon mapping
const iconMap: Record<string, any> = {
  Star,
  Heart,
  Zap,
  FileText,
  Smile,
  PlusSquare,
  Archive,
  Bell,
  Tag,
  BarChart2,
  RotateCcw,
  MapPin,
  Gift,
  CreditCard,
  ShoppingCart,
  Eye,
  Clock,
  Activity,
  Grid,
  DollarSign,
  BellRing,
  Percent,
  AlertCircle,
  Image,
  BellOff,
  Headphones,
  Calendar,
  CornerUpLeft,
  ShoppingBag,
  Layers,
  Truck,
  RefreshCcw,
  Barcode,
  DivideSquare,
  Edit2,
  TrendingUp,
  CircleDollarSign
};

const getIconComponent = (name: string) => iconMap[name] || Star;

// Kirim ke WhatsApp
const sendAnswers = () => {
  let text = "Hasil Questioner:\n\n";

  // Tambahkan info pelanggan
  text += `Nama: ${customer.value.name || '-'}\n`;
  text += `Kontak: ${customer.value.contact || '-'}\n`;
  text += `Nama Usaha: ${customer.value.businessName || '-'}\n`;
  text += `Jenis Usaha: ${customer.value.businessType || '-'}\n`;
  text += `Alamat Usaha: ${customer.value.businessAddress || '-'}\n\n`;

  // Tambahkan jawaban questioner
  props.questions.forEach((q, index) => {
    const answer = answers.value[index] || 'Tidak Dijawab';
    text += `${index + 1}. ${q.question}\nJawaban: ${answer}\n\n`;
  });

  const phone = '6285950540055';
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(waLink, '_blank'); // buka di tab baru
};
</script>

<style scoped>
/* Optional: hover/transition efek */
</style>
