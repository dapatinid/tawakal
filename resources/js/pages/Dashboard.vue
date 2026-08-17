<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/vue3';
import { ref, onMounted, computed } from 'vue';
import PlaceholderPattern from '../components/PlaceholderPattern.vue';
import { Chart, registerables } from 'chart.js';
import { onUnmounted } from 'vue';


Chart.register(...registerables);

const page = usePage();
const user = page.props.auth.user;
const stats = page.props.dashboardStats ?? {
    orderCount: 0,
    orderCountNominal: 0,
    orderPending: 0,
    orderPendingNominal: 0,
    orderPaid: 0,
    orderPaidNominal: 0,
};
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

const chartData = page.props.chartData || [];
const topProducts = page.props.topProducts || [];
const paymentStats = page.props.paymentStats || { today: [], yesterday: [] };

// Refs untuk Canvas
const lineChart = ref<HTMLCanvasElement>();
const barChart = ref<HTMLCanvasElement>();
const donutChart = ref<HTMLCanvasElement>();

// State untuk Toggle Payment
const paymentPeriod = ref<'today' | 'yesterday'>('today');
let lineChartInstance = null;
let barChartInstance = null;
let donutChartInstance = null; // Pindahkan ke level atas agar bisa diakses fungsi update

const updateDonutChart = () => {
    if (!donutChartInstance) return;
    
    const rawData = paymentPeriod.value === 'today' ? paymentStats.today : paymentStats.yesterday;
    const dataArray = Array.isArray(rawData) ? rawData : Object.values(rawData);

    if (dataArray.length === 0) {
        donutChartInstance.data.labels = ['Tidak ada data'];
        donutChartInstance.data.datasets[0].data = [1];
        donutChartInstance.data.datasets[0].backgroundColor = ['#E5E7EB'];
    } else {
        donutChartInstance.data.labels = dataArray.map((p) => p.payment_method ?? 'N/A');
        donutChartInstance.data.datasets[0].data = dataArray.map((p) => Number(p.total));
        donutChartInstance.data.datasets[0].backgroundColor = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];
    }
    
    donutChartInstance.update();
};

onMounted(() => {

    // 1. LINE CHART — pakai if, BUKAN early return
    if (lineChart.value) {
        const labels = chartData.map(d => {
            const date = new Date(d.date);
            return date.getDate() + ' ' + date.toLocaleString('id-ID', { month: 'short' });
        });

        const orderData = chartData.map(d => d.order_total);
        const paymentData = chartData.map(d => d.payment_total);

        lineChartInstance = new Chart(lineChart.value, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Grand Total (Order)',
                        data: orderData,
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Nominal (Payment)',
                        data: paymentData,
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(0, 0, 255, 0.3)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) { return value.toLocaleString(); }
                        }
                    }
                }
            }
        });
    } // ← tutup if line chart di sini

    // 2. BAR CHART
const abbreviate = (name: string) =>
    name.split(' ').map(w => w[0]?.toUpperCase() ?? '').join('');
        
if (barChart.value) {
    barChartInstance = new Chart(barChart.value, {
        type: 'bar',
        data: {
            labels: topProducts.map((p) => abbreviate(p.name)),
            datasets: [{
                label: 'Qty Terjual',
                data: topProducts.map((p) => p.total_qty),
                backgroundColor: '#10B981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                tooltip: {
                    callbacks: {
                        title: (items) => topProducts[items[0].dataIndex].name, // nama lengkap
                        label: (ctx) => ` Qty: ${ctx.raw}`,
                    }
                }
            }
        }
    });
}

    // 3. DONUT CHART
    if (donutChart.value) {
        const initialData = Array.isArray(paymentStats.today)
            ? paymentStats.today
            : Object.values(paymentStats.today);

        donutChartInstance = new Chart(donutChart.value, {
            type: 'doughnut',
            data: {
                labels: initialData.length > 0 
                    ? initialData.map((p) => p.payment_method ?? 'N/A')
                    : ['Tidak ada data'],
                datasets: [{
                    data: initialData.length > 0 
                        ? initialData.map((p) => Number(p.total))
                        : [1],
                    backgroundColor: initialData.length > 0
                        ? ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6']
                        : ['#E5E7EB'],
                }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                if (initialData.length === 0) return 'Tidak ada transaksi';
                                return ` ${ctx.label}: ${Number(ctx.raw).toLocaleString('id-ID')}`;
                            }
                        }
                    }
                }
            }
        });
    }
});

onUnmounted(() => {
    lineChartInstance?.destroy();
    barChartInstance?.destroy();
    donutChartInstance?.destroy();
});
</script>


<template>
    <Head title="Dashboard" />

    <AppLayout :breadcrumbs="breadcrumbs">
        <div
            class="flex h-full flex-1 flex-col gap-4 rounded-xl p-3"
        >

        <p class="text-primary dark:text-primary mx-auto font-bold mt-2">Halo {{ user.name }}</p>

        <div class="grid auto-rows-min gap-4 md:grid-cols-3"
            v-if="user?.is_admin"
            >
            <div
                class="relative aspect-video rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 dark:border-sidebar-border p-6 flex flex-col justify-center"
            > <h2 class="absolute right-4 text-3xl font-bold">🚀</h2>
                <p class="text-gray-500 dark:text-gray-300">Total Order</p>
                <h1 class="text-4xl font-bold">{{ Number(stats.orderCount).toLocaleString() }}</h1>
                <h1 class="text-xl font-bold">{{ Number(stats.orderCountNominal).toLocaleString() }}</h1>
            </div>

            <div
                class="relative aspect-video rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 dark:border-sidebar-border p-6 flex flex-col justify-center"
            > <h2 class="absolute right-4 text-3xl font-bold">⏳</h2>
                <p class="text-gray-500 dark:text-gray-300">Pending</p>
                <h1 class="text-4xl font-bold">{{ stats.orderPending }}</h1>
                <h1 class="text-xl font-bold">{{ Number(stats.orderPendingNominal).toLocaleString() }}</h1>
            </div>

            <div
                class="relative aspect-video rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 dark:border-sidebar-border p-6 flex flex-col justify-center"
            > <h2 class="absolute right-4 text-3xl font-bold">💰</h2>
                <p class="text-gray-500 dark:text-gray-300">Paid</p>
                <h1 class="text-4xl font-bold">{{ Number(stats.orderPaid).toLocaleString() }}</h1>
                <h1 class="text-xl font-bold">{{ Number(stats.orderPaidNominal).toLocaleString() }}</h1>
            </div>
        </div>

        <div
            class="flex-1 rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6"
        >
            
            <h3 class="font-bold text-lg">Peforma Penjualan (7 Hari Terakhir)</h3>
            <div v-if="user?.is_admin" class="mt-6">
                <div class="relative w-full h-[260px] sm:h-[320px] md:h-auto">
                    <canvas ref="lineChart"></canvas>
                </div>
            </div>
        </div>

        <div
            class="flex-1 md:min-h-min"
        >
            <!-- Secondary Charts Row -->
            <div v-if="user?.is_admin" class="flex flex-wrap gap-4">
                
                <!-- Bar Chart: 10 Produk Terlaris (2/3 width) -->
                <div class="w-full lg:flex-[2] min-w-[300px] p-6 rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <h3 class="font-bold mb-4 text-lg">Top 10 Produk (30 Bln Terakhir)</h3>
                    <div class="relative h-[400px]">
                        <canvas ref="barChart"></canvas>
                    </div>
                </div>

                <!-- Donut Chart: Payment (1/3 width) -->
                <div class="w-full lg:flex-[1] min-w-[300px] p-6 rounded-xl bg-background/50 backdrop-blur-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="font-bold text-lg">Metode Bayar</h3>
                        <div class="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button 
                                @click="paymentPeriod = 'today'; updateDonutChart()"
                                :class="['px-3 py-1 text-xs rounded-md transition', paymentPeriod === 'today' ? 'bg-white dark:bg-gray-700 shadow-sm' : '']"
                            >Hari Ini</button>
                            <button 
                                @click="paymentPeriod = 'yesterday'; updateDonutChart()"
                                :class="['px-3 py-1 text-xs rounded-md transition', paymentPeriod === 'yesterday' ? 'bg-white dark:bg-gray-700 shadow-sm' : '']"
                            >Kemarin</button>
                        </div>
                    </div>
                    <div class="relative h-[340px]">
                        <canvas ref="donutChart"></canvas>
                    </div>
                </div>

            </div>
        </div>

        </div>
    </AppLayout>
</template>
