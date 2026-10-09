import SwiftUI

@main
struct HabitaInmobiliariaApp: App {
    var body: some Scene { WindowGroup { HabitaTabView() } }
}

private struct HabitaTabView: View {
    var body: some View {
        TabView {
            DashboardView().tabItem { Label("Resumen", systemImage: "square.grid.2x2.fill") }
            OperationsView().tabItem { Label("Agenda", systemImage: "calendar") }
            OperationsView(title: "Ofertas", detail: "Negociaciones bajo trazabilidad", icon: "doc.text.fill").tabItem { Label("Ofertas", systemImage: "doc.text.fill") }
            AccountView().tabItem { Label("Cuenta", systemImage: "person.crop.circle") }
        }
        .tint(HabitaTheme.coral)
    }
}

private struct DashboardView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("HABITA INMOBILIARIA").font(.caption.weight(.semibold)).tracking(1.4).foregroundStyle(.secondary)
                    Text("Tu operación,\nen movimiento.").font(.system(size: 38, weight: .regular, design: .rounded)).tracking(0.6)
                    Text("Controla inventario, clientes y cierres desde un único lugar.").foregroundStyle(.secondary)
                    MetricGrid()
                    OperationsView(title: "Próximas visitas", detail: "Sin visitas programadas", icon: "calendar.badge.clock")
                }.padding(20)
            }
            .background(HabitaTheme.night.ignoresSafeArea())
            .foregroundStyle(.white)
            .navigationTitle("Resumen")
        }
    }
}

private struct MetricGrid: View {
    let metrics = [("Propiedades", "24", "building.2.fill"), ("Clientes", "18", "person.2.fill"), ("Visitas", "3", "calendar"), ("Ofertas", "4", "doc.text.fill")]
    var body: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            ForEach(metrics, id: \.0) { metric in
                VStack(alignment: .leading, spacing: 12) {
                    Image(systemName: metric.2).foregroundStyle(HabitaTheme.coral)
                    Text(metric.1).font(.title.bold())
                    Text(metric.0).font(.caption).foregroundStyle(.secondary)
                }.frame(maxWidth: .infinity, minHeight: 128, alignment: .leading).padding(16).background(HabitaTheme.plum, in: RoundedRectangle(cornerRadius: 20))
            }
        }
    }
}

private struct OperationsView: View {
    var title = "Agenda"
    var detail = "Programa y confirma visitas desde cualquier lugar"
    var icon = "calendar.badge.clock"
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack { Image(systemName: icon).foregroundStyle(HabitaTheme.coral); Text(title).font(.title3.weight(.medium)) }
            Text(detail).foregroundStyle(.secondary)
            Button("Crear nueva") {}.buttonStyle(.borderedProminent).tint(HabitaTheme.coral).accessibilityLabel("Crear nueva entrada en \(title)")
        }.frame(maxWidth: .infinity, alignment: .leading).padding(18).background(HabitaTheme.plum, in: RoundedRectangle(cornerRadius: 20))
    }
}

private struct AccountView: View {
    var body: some View {
        NavigationStack { Form { Section("Habita Inmobiliaria") { Label("Andrés Morales", systemImage: "person.crop.circle.fill"); Text("Asesor senior").foregroundStyle(.secondary) } } .navigationTitle("Cuenta") }
    }
}

private enum HabitaTheme { static let night = Color(red: 0.094, green: 0.094, blue: 0.141); static let plum = Color(red: 0.149, green: 0.145, blue: 0.231); static let coral = Color(red: 1, green: 0.29, blue: 0.21) }
